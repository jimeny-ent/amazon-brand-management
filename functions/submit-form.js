const { Client } = require('@notionhq/client');

exports.handler = async (event) => {
  console.log('Function triggered');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    console.log('Event body:', event.body);
    const { company, email, message } = JSON.parse(event.body);
    
    const notion = new Client({ 
      auth: process.env.NOTION_API_KEY 
    });
    console.log('Database ID:', process.env.NOTION_DATABASE_ID);
    
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Name: {
          title: [{ text: { content: company } }]
        },
        Email: {
          email: email
        },
        Message: {
          rich_text: [{ text: { content: message } }]
        }
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Success', response })
    };
  } catch (error) {
    console.error('Error details:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      })
    };
  }
};
