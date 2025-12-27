const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'Tasks';

exports.handler = async (event) => {
    try {
        // Parse query parameters for pagination
        const limit = parseInt(event.queryStringParameters?.limit) || 100;
        const lastEvaluatedKey = event.queryStringParameters?.lastKey;
        
        // Validate limit
        if (limit < 1 || limit > 1000) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    error: 'Limit must be between 1 and 1000' 
                })
            };
        }

        // Use Query instead of Scan if you have a sort key
        // For demonstration, using Scan with limit for now
        const params = {
            TableName: tableName,
            Limit: limit
        };
        
        if (lastEvaluatedKey) {
            params.ExclusiveStartKey = JSON.parse(lastEvaluatedKey);
        }

        const result = await dynamoDB.scan(params).promise();

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tasks: result.Items,
                lastEvaluatedKey: result.LastEvaluatedKey,
                count: result.Count,
                scannedCount: result.ScannedCount
            })
        };
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to fetch tasks',
                details: error.message 
            })
        };
    }
};