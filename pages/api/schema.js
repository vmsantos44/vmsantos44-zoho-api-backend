export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const schema = {
    "openapi": "3.1.0",
    "info": {
      "title": "Zoho CRM API",
      "version": "1.0.0",
      "description": "Search contacts and leads, view notes, and send emails in Zoho CRM"
    },
    "servers": [
      {
        "url": "https://vmsantos44-zoho-api-backend.vercel.app"
      }
    ],
    "paths": {
      "/api/search-contact": {
        "get": {
          "operationId": "searchContact",
          "summary": "Search for a contact by name or email",
          "parameters": [
            {
              "name": "searchTerm",
              "in": "query",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "The name or email to search for"
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean"
                      },
                      "data": {
                        "type": "object"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/search-lead": {
        "get": {
          "operationId": "searchLead",
          "summary": "Search for a lead by name or email",
          "parameters": [
            {
              "name": "searchTerm",
              "in": "query",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "The first name, last name, or email to search for"
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean"
                      },
                      "data": {
                        "type": "object"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/get-notes": {
        "get": {
          "operationId": "getNotes",
          "summary": "Get all notes for a specific record",
          "parameters": [
            {
              "name": "module",
              "in": "query",
              "required": true,
              "schema": {
                "type": "string",
                "enum": ["Contacts", "Leads", "Deals", "Accounts"]
              },
              "description": "The Zoho CRM module (Contacts, Leads, Deals, or Accounts)"
            },
            {
              "name": "recordId",
              "in": "query",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "The record ID to get notes for"
            }
          ],
          "responses": {
            "200": {
              "description": "Successful response",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean"
                      },
                      "data": {
                        "type": "object"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/send-email": {
        "post": {
          "operationId": "sendEmail",
          "summary": "Send an email via Zoho CRM",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "toAddress": {
                      "type": "string",
                      "description": "Recipient email address"
                    },
                    "subject": {
                      "type": "string",
                      "description": "Email subject"
                    },
                    "body": {
                      "type": "string",
                      "description": "Email body content"
                    },
                    "fromAddress": {
                      "type": "string",
                      "description": "Optional sender email address"
                    }
                  },
                  "required": ["toAddress", "subject", "body"]
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Email sent successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean"
                      },
                      "data": {
                        "type": "object"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  return res.status(200).json(schema);
}
