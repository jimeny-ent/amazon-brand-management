const { Client } = require('@notionhq/client');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const notion = new Client({ auth: process.env.ntn_x47719146521lTZLmwUJweBDkhnj4AprqnWxhEwi0ZT1x4 });
  const { company, email, message } = JSON.parse(event.body);

  try {
    await notion.pages.create({
      parent: { database_id: process.env.13e11c6da39c8003a00ff06339c07e9c },
      properties: {
        Name: {
          title: [{ text: { content: company } }]
        },
        Email: {
          email: email
        },
        Info: {
          rich_text: [{ text: { content: message } }]
        }
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Success' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit to Notion' })
    };
  }
};
