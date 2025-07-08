# AdminApi

All URIs are relative to *https://api.mayavoicetranslator.app/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createTask**](#createtask) | **POST** /admin/tasks | Create a new validation task|
|[**reviewCorrection**](#reviewcorrection) | **POST** /corrections/{correctionId}/review | Review a correction|

# **createTask**
> Task createTask(task)

Allows an admin to create a new task.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    Task
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let task: Task; //

const { status, data } = await apiInstance.createTask(
    task
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **task** | **Task**|  | |


### Return type

**Task**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Task created successfully |  -  |
|**400** | The request was malformed or invalid. |  -  |
|**401** | Authentication information is missing or invalid. |  -  |
|**403** | The user does not have permission to perform this action. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **reviewCorrection**
> Correction reviewCorrection(reviewCorrectionRequest)

Admins can approve or reject a submitted correction.

### Example

```typescript
import {
    AdminApi,
    Configuration,
    ReviewCorrectionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AdminApi(configuration);

let correctionId: string; // (default to undefined)
let reviewCorrectionRequest: ReviewCorrectionRequest; //

const { status, data } = await apiInstance.reviewCorrection(
    correctionId,
    reviewCorrectionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reviewCorrectionRequest** | **ReviewCorrectionRequest**|  | |
| **correctionId** | [**string**] |  | defaults to undefined|


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
|**200** | Review completed successfully |  -  |
|**400** | The request was malformed or invalid. |  -  |
|**401** | Authentication information is missing or invalid. |  -  |
|**403** | The user does not have permission to perform this action. |  -  |
|**404** | The requested resource was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

