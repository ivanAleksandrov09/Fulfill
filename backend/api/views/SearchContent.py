from api.models import PDFDocument, TextDocument
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.exceptions import ObjectDoesNotExist


class SearchContentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, *args, **kwargs):
        query = request.query_params["query"]

        if not query:
            return Response("Please provide a query.", status=400)
        
        results = []

        pdfDocuments = PDFDocument.objects.filter(document_name__icontains=query)
        if pdfDocuments:
            results.append(pdfDocuments)

        textDocuments = TextDocument.objects.filter(document_name__icontains=query)
        if textDocuments:
            results.append(textDocuments)

        if not results:
            return Response(results, status=200)
                
        documentsJSON = [result[0].document_data for result in results]
        return Response(documentsJSON, status=200)

