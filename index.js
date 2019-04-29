'use strict';
console.log('Loading function');
const doc = require('dynamodb-doc');
const dynamo = new doc.DynamoDB();

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    const done = (err, res) => callback(null, {
        statusCode: err ? '400' : '200',
        body: err ? err.message : JSON.stringify(res),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    var tableName = "sample-table";
    switch (event.httpMethod) {
        case 'DELETE':
            dynamo.deleteItem({
                    "TableName": tableName,
                    "Key": {
                        "id": event.id
                    }
                }, done);
            break;
        case 'GET':
            if (event.id)
                dynamo.getItem({
                    "TableName": tableName,
                    "Key": {
                        "id": event.id
                    }
                }, done);
            else
                dynamo.scan({ TableName: tableName }, done);
            break;
        case 'POST':
            dynamo.putItem({
                    "TableName": tableName,
                    "Item": {
                        "id": event.id,
                        "title": event.title,
                        "masking_time": event.masking_time,
                        "serves": event.serves,
                        "ingredients": event.ingredients,
                        "cost": event.cost
                    }
                }, done);
            break;
        default:
            done(new Error(`Unsupported method "${event.httpMethod}"`));
    }
};


