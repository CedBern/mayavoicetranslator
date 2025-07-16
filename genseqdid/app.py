from flask import Flask, request, jsonify

app = Flask(__name__)

# Mock databases
sequences = []
library_documents = [
    {"id": "1", "title": "Document 1", "description": "Description du Document 1", "url": "http://example.com/doc1", "date": "2023-01-01", "content": "Contenu du Document 1"},
    {"id": "2", "title": "Document 2", "description": "Description du Document 2", "url": "http://example.com/doc2", "date": "2023-01-02", "content": "Contenu du Document 2"}
]
internet_resources = [
    {"id": "1", "title": "Ressource 1", "description": "Description de la Ressource 1", "url": "http://example.com/res1", "date": "2023-01-01", "content": "Contenu de la Ressource 1"},
    {"id": "2", "title": "Ressource 2", "description": "Description de la Ressource 2", "url": "http://example.com/res2", "date": "2023-01-02", "content": "Contenu de la Ressource 2"}
]

@app.route('/api/sequences', methods=['POST'])
def create_sequence():
    data = request.get_json()
    sequences.append(data)
    return jsonify({"message": "Sequence created successfully", "data": data}), 201

@app.route('/api/sequences', methods=['GET'])
def get_sequences():
    return jsonify(sequences)

@app.route('/api/sequences/<int:id>', methods=['PUT'])
def update_sequence(id):
    data = request.get_json()
    if id < len(sequences):
        sequences[id] = data
        return jsonify({"message": "Sequence updated successfully", "data": data})
    else:
        return jsonify({"message": "Sequence not found"}), 404

@app.route('/api/sequences/<int:id>', methods=['DELETE'])
def delete_sequence(id):
    if id < len(sequences):
        sequences.pop(id)
        return jsonify({"message": "Sequence deleted successfully"})
    else:
        return jsonify({"message": "Sequence not found"}), 404

@app.route('/api/library/search', methods=['GET'])
def search_library():
    query = request.args.get('query', '')
    page = int(request.args.get('page', 0))
    page_size = int(request.args.get('page_size', 20))
    sort_by = request.args.get('sort_by', 'created_at')
    sort_order = request.args.get('sort_order', 'desc')

    filtered_documents = [doc for doc in library_documents if query.lower() in doc['title'].lower() or query.lower() in doc['description'].lower()]
    start_index = page * page_size
    end_index = start_index + page_size
    paginated_documents = filtered_documents[start_index:end_index]
    return jsonify(paginated_documents)

@app.route('/api/library/documents/<string:id>', methods=['GET'])
def get_library_document(id):
    for doc in library_documents:
        if doc['id'] == id:
            return jsonify(doc)
    return jsonify({"message": "Document not found"}), 404

@app.route('/api/internet/search', methods=['GET'])
def search_internet():
    query = request.args.get('query', '')
    page = int(request.args.get('page', 0))
    page_size = int(request.args.get('page_size', 20))
    sort_by = request.args.get('sort_by', 'relevance')
    sort_order = request.args.get('sort_order', 'desc')

    filtered_resources = [res for res in internet_resources if query.lower() in res['title'].lower() or query.lower() in res['description'].lower()]
    start_index = page * page_size
    end_index = start_index + page_size
    paginated_resources = filtered_resources[start_index:end_index]
    return jsonify(paginated_resources)

@app.route('/api/internet/resources/<string:id>', methods=['GET'])
def get_internet_resource(id):
    for res in internet_resources:
        if res['id'] == id:
            return jsonify(res)
    return jsonify({"message": "Resource not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
