import io
import json

from google.genai.types import GenerateContentResponse
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
            return Response("Input file is required", status=400)

        if not uploadedFile.name.lower().endswith(".pdf"):
            return Response({"error": "Uploaded file is not a PDF"}, status=400)

        fileBytes = None
        try:
            fileBytes = uploadedFile.read()
        except Exception as e:
            return Response(f"Error reading uploaded PDF file: {e}", status=500)

        clientUploadedFile = None
        try:
            clientUploadedFile = client.files.upload(
                file=io.BytesIO(fileBytes), config={"mime_type": "application/pdf"}
            )
        except Exception as e:
            return Response(f"Error when uploading PDF file to client: {e}", status=500)

        try:
            response: GenerateContentResponse = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[
                    systemPrompt,
                    clientUploadedFile,
                ],
                config={
                    "response_mime_type": "application/json",
                    "response_schema": {
                        "type": "object",
                        "properties": {
                            "logical_parts": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                },
                            },
                        },
                        "required": [
                            "logical_parts",
                        ],
                    },
                },
            )
        except Exception as e:
            return Response(
                f"Error when generating content logical parts: {e}", status=500
            )

        return Response(json.loads(response.text), status=200)


systemPrompt = """
Given the following PDF document, please:

1. Identify and list the main logical parts/sections of the document as an array

Note: Return only the results without any explanation.

Respond in the following JSON format:
{
    "logical_parts": ["part1", "part2", ...]
}
"""
