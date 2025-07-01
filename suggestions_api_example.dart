// Exemple d'intégration Flutter/Dart pour consommer l'API /api/suggestions
// Place ce code dans un fichier Dart (ex: suggestions_api_example.dart)

import 'dart:convert';
import 'package:http/http.dart' as http;

Future<void> fetchSuggestions(String query) async {
  final url = Uri.parse('http://localhost:3000/api/suggestions');
  final response = await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      'query': query,
      'targetLanguage': 'en',
      'maxSuggestions': 7,
    }),
  );
  if (response.statusCode == 200) {
    final data = jsonDecode(response.body);
    print('Suggestions:');
    for (var s in data['suggestions']) {
      print('- [${s['source'] ?? 'local'}] ${s['text']} (score: ${s['relevanceScore']})');
    }
  } else {
    print('Erreur: ${response.statusCode} ${response.body}');
  }
}

void main() async {
  await fetchSuggestions('bonjour');
}
