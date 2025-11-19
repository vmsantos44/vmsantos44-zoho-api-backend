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
    // Get OAuth token
    const tokenResponse = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/oauth-token`);
    const { access_token } = await tokenResponse.json();

    // Fetch related records (Activities in Zoho includes Emails, Calls, Tasks, Events)
    const relatedUrl = `https://www.zohoapis.com/crm/v2/${module}/${recordId}/Activities`;

    const response = await fetch(relatedUrl, {
      headers: {
        'Authorization': `Zoho-oauthtoken ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      // If 204 No Content, there are no activities
      if (response.status === 204) {
        return res.status(200).json({
          success: true,
          emails: [],
          calls: [],
          tasks: [],
          events: [],
          message: 'No communications found for this record'
        });
      }

      const errorText = await response.text();
      throw new Error(`Zoho API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Separate activities by type
    const emails = [];
    const calls = [];
    const tasks = [];
    const events = [];

    if (data.data && Array.isArray(data.data)) {
      data.data.forEach(activity => {
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
    console.error('Error fetching communications:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch communications',
      details: error.message
    });
  }
}
