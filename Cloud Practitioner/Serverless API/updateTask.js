const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'Tasks';

exports.handler = async (event) => {
    try {
        // 1. Validate input
        const taskId = event.pathParameters?.id;
        
        if (!taskId) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Task ID is required in the path parameters' 
                })
            };
        }

        let updateData;
        try {
            updateData = JSON.parse(event.body || '{}');
        } catch (parseError) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Invalid JSON in request body' 
                })
            };
        }

        // 2. Validate allowed fields to update
        const allowedFields = ['title', 'description', 'completed'];
        const updateFields = Object.keys(updateData);
        
        const invalidFields = updateFields.filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: `Invalid fields: ${invalidFields.join(', ')}. Allowed fields: ${allowedFields.join(', ')}` 
                })
            };
        }

        // 3. Check if task exists first
        const checkParams = {
            TableName: tableName,
            Key: { taskId: taskId }
        };
        
        const existingTask = await dynamoDB.get(checkParams).promise();
        if (!existingTask.Item) {
            return {
                statusCode: 404,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: `Task with ID ${taskId} not found` 
                })
            };
        }

        // 4. Prepare update expression
        let updateExpression = 'SET ';
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};
        
        updateFields.forEach((field, index) => {
            if (index > 0) updateExpression += ', ';
            updateExpression += `#${field} = :${field}`;
            expressionAttributeNames[`#${field}`] = field;
            expressionAttributeValues[`:${field}`] = updateData[field];
        });

        // Add updatedAt timestamp
        updateExpression += ', #updatedAt = :updatedAt';
        expressionAttributeNames['#updatedAt'] = 'updatedAt';
        expressionAttributeValues[':updatedAt'] = new Date().toISOString();

        // 5. Update the task in DynamoDB
        const updateParams = {
            TableName: tableName,
            Key: { taskId: taskId },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };

        const result = await dynamoDB.update(updateParams).promise();

        // 6. Return the updated task
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Task updated successfully',
                task: result.Attributes
            })
        };
    } catch (error) {
        console.error('Error updating task:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                error: 'Failed to update task',
                details: error.message 
            })
        };
    }
};