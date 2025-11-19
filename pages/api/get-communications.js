const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { module, recordId } = req.query;

  if (!module || !recordId) {
    return res.status(400).json({
      error: 'Missing required parameters: module, recordId'
    });
  }

  // Validate module
  const validModules = ['Contacts', 'Leads', 'Deals', 'Accounts'];
  if (!validModules.includes(module)) {
    return res.status(400).json({
      error: `Invalid module. Must be one of: ${validModules.join(', ')}`
    });
  }

  try {
    // Get access token using refresh token
    const tokenResponse = await axios.post(
      'https://accounts.zoho.com/oauth/v2/token',
      null,
      {
        params: {
          refresh_token: process.env.ZOHO_REFRESH_TOKEN,
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          grant_type: 'refresh_token'
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Fetch related records (Activities in Zoho includes Emails, Calls, Tasks, Events)
    const response = await axios.get(
      `https://www.zohoapis.com/crm/v2/${module}/${recordId}/Activities`,
      {
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

    // Separate activities by type
    const emails = [];
    const calls = [];
    const tasks = [];
    const events = [];

    if (response.data.data && Array.isArray(response.data.data)) {
      response.data.data.forEach(activity => {
        // Zoho uses $se_module to indicate activity type
        const activityType = activity.$se_module;

        if (activityType === 'Emails') {
          emails.push({
            id: activity.id,
            subject: activity.Subject,
            from: activity.From,
            to: activity.To,
            cc: activity.CC,
            date: activity.Sent_Time || activity.Created_Time,
            content: activity.Content,
            status: activity.Mail_Status
          });
        } else if (activityType === 'Calls') {
          calls.push({
            id: activity.id,
            subject: activity.Subject,
            call_type: activity.Call_Type,
            call_duration: activity.Call_Duration,
            call_start_time: activity.Call_Start_Time,
            description: activity.Description,
            owner: activity.Owner?.name
          });
        } else if (activityType === 'Tasks') {
          tasks.push({
            id: activity.id,
            subject: activity.Subject,
            status: activity.Status,
            priority: activity.Priority,
            due_date: activity.Due_Date,
            description: activity.Description
          });
        } else if (activityType === 'Events') {
          events.push({
            id: activity.id,
            title: activity.Event_Title,
            start_datetime: activity.Start_DateTime,
            end_datetime: activity.End_DateTime,
            location: activity.Venue,
            description: activity.Description
          });
        }
      });
    }

    return res.status(200).json({
      success: true,
      count: {
        emails: emails.length,
        calls: calls.length,
        tasks: tasks.length,
        events: events.length,
        total: (emails.length + calls.length + tasks.length + events.length)
      },
      emails: emails,
      calls: calls,
      tasks: tasks,
      events: events
    });

  } catch (error) {
    // If 204 No Content or 404, there are no activities
    if (error.response?.status === 204 || error.response?.status === 404) {
      return res.status(200).json({
        success: true,
        count: {
          emails: 0,
          calls: 0,
          tasks: 0,
          events: 0,
          total: 0
        },
        emails: [],
        calls: [],
        tasks: [],
        events: [],
        message: 'No communications found for this record'
      });
    }

    console.error('Error fetching communications:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch communications',
      details: error.response?.data || error.message
    });
  }
}
