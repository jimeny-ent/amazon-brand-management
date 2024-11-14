const { Client } = require('@notionhq/client');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const { company, email, message } = JSON.parse(event.body);

  try {
    await notion.pages.create({
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
      body: JSON.stringify({ message: 'Success' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit to Notion' })
    };
  }
};
