import json

from api.models import TextDocument
from google.genai.types import GenerateContentResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from .GeminiClient import client


class TextAnalyzerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, *args, **kwargs):
        inputText = request.data.get("text")

        if not inputText:
            return Response("Input text is required", status=400)

        try:
            response: GenerateContentResponse = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=[
                    systemPrompt,
                    inputText,
                ],
                config={
                    "response_mime_type": "application/json",
                    "response_schema": jsonSchema,
                },
            )
        except Exception as e:
            return Response(
                f"Error when generating content logical parts: {e}", status=500
            )
        
        newTextDocument, created = TextDocument.objects.get_or_create(
            user=request.user,
            documentData = json.loads(response.text)
        )
        newTextDocument.save()

        return Response(json.loads(response.text), status=200)


systemPrompt = """
Given the following text, please:

1. Return a text name summarizing the entire text

2. Return the given text back formatted to maximize readability and retention by adding line breaks
after the end of each important section text

3. Identify and list the main logical parts/sections of the text as an array

4. Construct questions relating the most key concepts of the document in the format of
3 wrong answers and 1 right answer, returning an array of objects with values for:
"question" (string), "wrong_answers" (array), "right answer" (string), "trigger_sentence" (sentence that
appears after the key concept has been explained fully)

Note: Return only the results without any explanation.

Respond in the following JSON format:
{
    "summarized_name": "text",
    "formatted_text": "formatted text here",
    "logical_parts": ["part1", "part2", ...],
    "questions": [
        "question",
        "wrong_answers": ["answer1", "answer2", ...]
        "right_answer",
        "trigger_sentence"
    ]
}
"""

jsonSchema = {
    "type": "object",
    "properties": {
        "summarized_name": {
            "type": "string"
        },
        "formatted_text": {
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
                    "trigger_sentence": {"type": "string"},
                },
                "required": ["question", "wrong_answers", "right_answer", "trigger_sentence"],
            },
        },
    },
    "required": ["summarized_name", "formatted_text", "logical_parts", "questions"],
}

