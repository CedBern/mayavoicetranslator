# TasksApi

All URIs are relative to *https://api.mayavoicetranslator.app/v1*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getTaskById**](#gettaskbyid) | **GET** /tasks/{taskId} | Get a specific task by ID|
|[**getTasks**](#gettasks) | **GET** /tasks | Get a list of available validation tasks|
|[**updateTaskStatus**](#updatetaskstatus) | **PUT** /tasks/{taskId} | Update a task\&#39;s status (claim/unclaim)|

# **getTaskById**
> Task getTaskById()

Fetches details for a single task.

### Example

```typescript
import {
    TasksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let taskId: string; // (default to undefined)

const { status, data } = await apiInstance.getTaskById(
    taskId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **taskId** | [**string**] |  | defaults to undefined|


### Return type

**Task**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Task details |  -  |
|**401** | Authentication information is missing or invalid. |  -  |
|**404** | The requested resource was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getTasks**
> Array<Task> getTasks()

Fetches a list of tasks available for the authenticated user. Can be filtered by status, type, and assigned user. Validators can see tasks assigned to them. Admins can see all tasks.

### Example

```typescript
import {
    TasksApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let status: 'pending' | 'in_progress' | 'completed' | 'rejected'; //Filter tasks by status (optional) (default to undefined)
let type: 'transcription' | 'translation' | 'dictionary'; //Filter tasks by type (optional) (default to undefined)
let assignedTo: string; //Filter tasks by assigned user ID (Admin only) (optional) (default to undefined)

const { status, data } = await apiInstance.getTasks(
    status,
    type,
    assignedTo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**&#39;pending&#39; | &#39;in_progress&#39; | &#39;completed&#39; | &#39;rejected&#39;**]**Array<&#39;pending&#39; &#124; &#39;in_progress&#39; &#124; &#39;completed&#39; &#124; &#39;rejected&#39;>** | Filter tasks by status | (optional) defaults to undefined|
| **type** | [**&#39;transcription&#39; | &#39;translation&#39; | &#39;dictionary&#39;**]**Array<&#39;transcription&#39; &#124; &#39;translation&#39; &#124; &#39;dictionary&#39;>** | Filter tasks by type | (optional) defaults to undefined|
| **assignedTo** | [**string**] | Filter tasks by assigned user ID (Admin only) | (optional) defaults to undefined|


### Return type

**Array<Task>**

### Authorization

[bearerAuth](../README.md#bearerAuth)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | A list of tasks |  -  |
|**401** | Authentication information is missing or invalid. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateTaskStatus**
> Task updateTaskStatus(updateTaskStatusRequest)

Allows a user to claim a pending task or release a task they are working on. Admins can also reassign tasks.

### Example

```typescript
import {
    TasksApi,
    Configuration,
    UpdateTaskStatusRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TasksApi(configuration);

let taskId: string; // (default to undefined)
let updateTaskStatusRequest: UpdateTaskStatusRequest; //

const { status, data } = await apiInstance.updateTaskStatus(
    taskId,
    updateTaskStatusRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTaskStatusRequest** | **UpdateTaskStatusRequest**|  | |
| **taskId** | [**string**] |  | defaults to undefined|


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
|**200** | Task updated successfully |  -  |
|**400** | The request was malformed or invalid. |  -  |
|**401** | Authentication information is missing or invalid. |  -  |
|**403** | The user does not have permission to perform this action. |  -  |
|**404** | The requested resource was not found. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

