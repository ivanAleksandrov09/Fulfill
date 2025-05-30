import hashlib
import io
import json

from api.models import PDFDocument
from django.core.exceptions import ObjectDoesNotExist
from google.genai.types import GenerateContentResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .GeminiClient import client


class PDFAnalyzerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, *args, **kwargs):
        uploadedFile = request.FILES["file"]

        if not uploadedFile:
            return Response("Input file is required", status=status.HTTP_400_BAD_REQUEST)

        if not uploadedFile.name.lower().endswith(".pdf"):
            return Response({"error": "Uploaded file is not a PDF"}, status=status.HTTP_400_BAD_REQUEST)

        fileBytes = None
        try:
            fileBytes = uploadedFile.read()
        except Exception as e:
            return Response(f"Error reading uploaded PDF file: {e}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        hashKey = hashlib.sha256(fileBytes).hexdigest()
        try:
            foundDocument = PDFDocument.objects.get(saved_hash=hashKey)
            return Response(foundDocument.document_data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            pass


        clientUploadedFile = None
        try:
            clientUploadedFile = client.files.upload(
                file=io.BytesIO(fileBytes), config={"mime_type": "application/pdf"}
            )
        except Exception as e:
            return Response(f"Error when uploading PDF file to client: {e}", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            response: GenerateContentResponse = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[
                    systemPrompt,
                    clientUploadedFile,
                ],
                config={
                    "response_mime_type": "application/json",
                    "response_schema": jsonSchema,
                },
            )
        except Exception as e:
            print(e)
            return Response(
                f"Error when generating content logical parts: {e}", status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        finalizedJSON = json.loads(response.text)
        
        newPDF: PDFDocument = PDFDocument(
            user = request.user,
            PDF = uploadedFile,
            document_data = finalizedJSON,
            document_name = finalizedJSON["summarized_name"],
            saved_hash = hashKey
        )
        newPDF.save()

        return Response(finalizedJSON, status=status.HTTP_200_OK)


systemPrompt = """
Given the following PDF document, please:

1. Return a list of keywords that can be used to find this document

2. Return a document name summarizing the entire pdf document

3. Identify and list the main logical parts/sections of the document as an array

4. Construct questions relating the most key concepts of the document in the format of
3 wrong answers and 1 right answer, returning an array of objects with values for:
"question" (string), "wrong_answers" (array), "right answer" (string), "page_trigger" (num
which indicates after which page is read should the question appear)

Note: Return only the results without any explanation.

Respond in the following JSON format:
{
    "keywords": ["keyword1", "keyword2", ...]
    "summarized_name": "text",
    "logical_parts": ["part1", "part2", ...]
    "questions": [
        "question",
        "wrong_answers": ["answer1", "answer2", ...]
        "right_answer",
        "page_trigger"
    ]
}
"""

jsonSchema = {
    "type": "object",
    "properties": {
        "keywords": {
            "type": "array",
            "items": {"type": "string"},
        },
        "summarized_name": {
            "type": "string"
        },
        "logical_parts": {
            "type": "array",
            "items": {
                "type": "string",
            },
        },
        "questions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "question": {"type": "string"},
                    "wrong_answers": {
                        "type": "array",
                        "items": {
                            "type": "string",
                        },
                    },
                    "right_answer": {"type": "string"},
                    "page_trigger": {"type": "integer"},
                },
                "required": ["question", "wrong_answers", "right_answer", "page_trigger"],
            },
        },
    },
    "required": ["keywords", "summarized_name", "logical_parts", "questions"],
}

