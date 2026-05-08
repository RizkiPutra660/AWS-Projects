const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'Tasks';
const { v4: uuidv4 } = require('uuid');

// Validation helper function
const validateTaskInput = (taskData) => {
    const errors = [];
    
    // Check required fields
    if (!taskData.title || taskData.title.trim() === '') {
        errors.push('Title is required');
    }
    
    if (taskData.title && taskData.title.length > 200) {
        errors.push('Title cannot exceed 200 characters');
    }
    
    if (taskData.description && taskData.description.length > 1000) {
        errors.push('Description cannot exceed 1000 characters');
    }
    
    // Validate completed field if provided
    if (taskData.completed !== undefined && typeof taskData.completed !== 'boolean') {
        errors.push('Completed field must be a boolean (true/false)');
    }
    
    return errors;
};

exports.handler = async (event) => {
    try {
        // 1. Parse and validate request body
        let requestBody;
        try {
            requestBody = JSON.parse(event.body || '{}');
        } catch (parseError) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Invalid JSON in request body' 
                })
            };
        }

        // 2. Run validation
        const validationErrors = validateTaskInput(requestBody);
        if (validationErrors.length > 0) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Validation failed',
                    details: validationErrors 
                })
            };
        }

        const { title, description, completed = false } = requestBody;

        // 3. Create new task
        const newTask = {
            taskId: uuidv4(),
            title: title.trim(),
            description: description ? description.trim() : '',
            createdAt: new Date().toISOString(),
            completed: completed,
            updatedAt: null
        };

        // 4. Save to DynamoDB
        await dynamoDB.put({
            TableName: tableName,
            Item: newTask
        }).promise();

        // 5. Return success response
        return {
            statusCode: 201,
            headers: { 
                'Content-Type': 'application/json',
                'Location': `/tasks/${newTask.taskId}`  // RESTful best practice
            },
            body: JSON.stringify({ 
                message: 'Task created successfully',
                task: newTask 
            })
        };
    } catch (error) {
        console.error('Error creating task:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to create task',
                details: error.message 
            })
        };
    }
};