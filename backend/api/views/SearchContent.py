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

        queryWords = query.split(" ")
        print(queryWords)

        if not query:
            return Response("Please provide a query.", status=400)
        
        results = []

        for word in queryWords:
            pdfDocuments = PDFDocument.objects.filter(document_name__icontains=word)
            if pdfDocuments:
                pdfSerializer = PDFDocumentSerializer(pdfDocuments, many=True)
                results.extend(pdfSerializer.data)

            textDocuments = TextDocument.objects.filter(document_name__icontains=word)
            if textDocuments:
                textSerializer = TextDocumentSerializer(textDocuments, many=True)
                results.extend(textSerializer.data)

        if not results:
            return Response(results, status=200)

        # we filter out duplicate data by turning it into a dictionary with keys
        # being the document name, such that upon calling .values()
        # the duplicate results are removed, after which we can safely turn
        # the dictionary back into a list
        uniqueResults = {d['document_name']: d for d in results}.values()

        return Response(list(uniqueResults), status=200)

