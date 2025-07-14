# CorrectionsApi

All URIs are relative to *https://api.mayavoicetranslator.app/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getCorrectionsForTask**](#getcorrectionsfortask) | **GET** /tasks/{taskId}/corrections | Get all corrections for a task|
|[**submitCorrection**](#submitcorrection) | **POST** /tasks/{taskId}/corrections | Submit a correction for a task|

# **getCorrectionsForTask**
> Array<Correction> getCorrectionsForTask()

Fetches all submitted corrections for a specific task.

### Example

```typescript
import {
    CorrectionsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CorrectionsApi(configuration);

let taskId: string; // (default to undefined)

const { status, data } = await apiInstance.getCorrectionsForTask(
    taskId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **taskId** | [**string**] |  | defaults to undefined|


### Return type

**Array<Correction>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of corrections |  -  |
|**401** | Authentication information is missing or invalid. |  -  |
|**404** | The requested resource was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **submitCorrection**
> Correction submitCorrection(correctionSubmission)

Submits a new correction for a task. The task must be assigned to the user. The submitted data structure depends on the task type.

### Example

```typescript
import {
    CorrectionsApi,
    Configuration,
    CorrectionSubmission
} from './api';

const configuration = new Configuration();
const apiInstance = new CorrectionsApi(configuration);

let taskId: string; // (default to undefined)
let correctionSubmission: CorrectionSubmission; //

const { status, data } = await apiInstance.submitCorrection(
    taskId,
    correctionSubmission
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **correctionSubmission** | **CorrectionSubmission**|  | |
| **taskId** | [**string**] |  | defaults to undefined|


### Return type

**Correction**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Correction created successfully |  -  |
|**400** | The request was malformed or invalid. |  -  |
|**401** | Authentication information is missing or invalid. |  -  |
|**403** | The user does not have permission to perform this action. |  -  |
|**404** | The requested resource was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

