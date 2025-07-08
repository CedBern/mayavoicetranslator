# TaskData

The source data for the task (e.g., audio URL, text snippet)

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**audioUrl** | **string** |  | [default to undefined]
**existingTranscript** | **string** | A machine-generated transcript to start from | [optional] [default to undefined]
**sourceLanguage** | **string** |  | [default to undefined]
**targetLanguage** | **string** |  | [default to undefined]
**text** | **string** |  | [default to undefined]
**entry** | [**LexicalEntry**](LexicalEntry.md) |  | [default to undefined]

## Example

```typescript
import { TaskData } from './api';

const instance: TaskData = {
    audioUrl,
    existingTranscript,
    sourceLanguage,
    targetLanguage,
    text,
    entry,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
