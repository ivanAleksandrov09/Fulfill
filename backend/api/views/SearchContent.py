from api.models import PDFDocument, TextDocument
from api.serializers import PDFDocumentSerializer, TextDocumentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView


class SearchContentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, *args, **kwargs):
        query = request.GET.get("query")

        if not query:
            return Response("Please provide a query.", status=400)
        
        results = []

        pdfDocuments = PDFDocument.objects.filter(document_name__icontains=query)
        if pdfDocuments:
            pdfSerializer = PDFDocumentSerializer(pdfDocuments, many=True)
            results.append(pdfSerializer.data)

        textDocuments = TextDocument.objects.filter(document_name__icontains=query)
        if textDocuments:
            textSerializer = TextDocumentSerializer(textDocuments, many=True)
            results.append(textSerializer.data)

        if not results:
            return Response(results, status=200)
                        
        documentsJSON = [result[0] for result in results]
        return Response(documentsJSON, status=200)

