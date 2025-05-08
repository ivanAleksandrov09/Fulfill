import json

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
                    "response_schema": {
                        "type": "object",
                        "properties": {
                            "formatted_text": {
                                "type": "string",
                            },
                            "logical_parts": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                },
                            },
                        },
                        "required": [
                            "formatted_text",
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
Given the following text, please:
1. Return the given text back formatted to maximize readability and retention by adding line breaks
after the end of each important section text

2. Identify and list the main logical parts/sections of the text as an array

Note: Return only the results without any explanation.

Respond in the following JSON format:
{
    "formatted_text": "formatted text here",
    "logical_parts": ["part1", "part2", ...]
}
"""
