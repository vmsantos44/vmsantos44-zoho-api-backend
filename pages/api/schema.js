export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const schema = {
    "openapi": "3.1.0",
    "info": {
      "title": "Zoho CRM API",
      "version": "2.1.0",
      "description": "Search contacts and leads, view notes, send emails, view attachments, get full record details, view communications in Zoho CRM, and query reporting data from Zoho Sheet dashboard"
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
            },
            {
              "name": "limit",
              "in": "query",
              "required": false,
              "schema": {
                "type": "integer",
                "default": 10,
                "minimum": 1,
                "maximum": 50
              },
              "description": "Maximum number of results to return (default: 10, max: 50)"
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
            },
            {
              "name": "limit",
              "in": "query",
              "required": false,
              "schema": {
                "type": "integer",
                "default": 10,
                "minimum": 1,
                "maximum": 50
              },
              "description": "Maximum number of results to return (default: 10, max: 50)"
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
      },
      "/api/list-attachments": {
        "post": {
          "operationId": "listAttachments",
          "summary": "List all attachments for a Zoho CRM record",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "module": {
                      "type": "string",
                      "enum": ["Contacts", "Leads", "Deals", "Accounts"],
                      "description": "The Zoho CRM module (Contacts, Leads, Deals, or Accounts)"
                    },
                    "record_id": {
                      "type": "string",
                      "description": "The record ID to get attachments for"
                    }
                  },
                  "required": ["module", "record_id"]
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "List of attachments retrieved successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean"
                      },
                      "count": {
                        "type": "integer"
                      },
                      "attachments": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "id": {
                              "type": "string"
                            },
                            "file_name": {
                              "type": "string"
                            },
                            "size": {
                              "type": "integer"
                            },
                            "type": {
                              "type": "string"
                            },
                            "created_time": {
                              "type": "string"
                            },
                            "created_by": {
                              "type": "string"
                            },
                            "download_url": {
                              "type": "string"
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
        }
      },
      "/api/get-attachment": {
        "post": {
          "operationId": "getAttachment",
          "summary": "Download a specific attachment from a Zoho CRM record",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "module": {
                      "type": "string",
                      "enum": ["Contacts", "Leads", "Deals", "Accounts"],
                      "description": "The Zoho CRM module (Contacts, Leads, Deals, or Accounts)"
                    },
                    "record_id": {
                      "type": "string",
                      "description": "The record ID"
                    },
                    "attachment_id": {
                      "type": "string",
                      "description": "The attachment ID to download"
                    }
                  },
                  "required": ["module", "record_id", "attachment_id"]
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Attachment file content",
              "content": {
                "application/octet-stream": {
                  "schema": {
                    "type": "string",
                    "format": "binary"
                  }
                }
              }
            }
          }
        }
      },
      "/api/add-note": {
        "post": {
          "operationId": "addNote",
          "summary": "Add a note to a Zoho CRM record",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "module": {
                      "type": "string",
                      "enum": ["Contacts", "Leads", "Deals", "Accounts"],
                      "description": "The Zoho CRM module (Contacts, Leads, Deals, or Accounts)"
                    },
                    "record_id": {
                      "type": "string",
                      "description": "The record ID to add the note to"
                    },
                    "note_title": {
                      "type": "string",
                      "description": "Optional title for the note (defaults to 'Note from CRM Assistant')"
                    },
                    "note_content": {
                      "type": "string",
                      "description": "The content/body of the note"
                    }
                  },
                  "required": ["module", "record_id", "note_content"]
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Note added successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean"
                      },
                      "message": {
                        "type": "string"
                      },
                      "note_id": {
                        "type": "string"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/get-record": {
        "get": {
          "operationId": "getRecord",
          "summary": "Get full details for a specific CRM record",
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
              "description": "The record ID to retrieve"
            }
          ],
          "responses": {
            "200": {
              "description": "Record details retrieved successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean"
                      },
                      "data": {
                        "type": "object",
                        "description": "Complete record data including all fields, status, tier, owner, etc."
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/get-communications": {
        "get": {
          "operationId": "getCommunications",
          "summary": "Get email and call history for a CRM record",
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
              "description": "The record ID to get communications for"
            }
          ],
          "responses": {
            "200": {
              "description": "Communications retrieved successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean"
                      },
                      "count": {
                        "type": "object",
                        "properties": {
                          "emails": { "type": "integer" },
                          "calls": { "type": "integer" },
                          "tasks": { "type": "integer" },
                          "events": { "type": "integer" },
                          "total": { "type": "integer" }
                        }
                      },
                      "emails": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "id": { "type": "string" },
                            "subject": { "type": "string" },
                            "from": { "type": "string" },
                            "to": { "type": "string" },
                            "cc": { "type": "string" },
                            "date": { "type": "string" },
                            "content": { "type": "string" },
                            "status": { "type": "string" }
                          }
                        }
                      },
                      "calls": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "id": { "type": "string" },
                            "subject": { "type": "string" },
                            "call_type": { "type": "string" },
                            "call_duration": { "type": "string" },
                            "call_start_time": { "type": "string" },
                            "description": { "type": "string" },
                            "owner": { "type": "string" }
                          }
                        }
                      },
                      "tasks": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "id": { "type": "string" },
                            "subject": { "type": "string" },
                            "status": { "type": "string" },
                            "priority": { "type": "string" },
                            "due_date": { "type": "string" },
                            "description": { "type": "string" }
                          }
                        }
                      },
                      "events": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "id": { "type": "string" },
                            "title": { "type": "string" },
                            "start_datetime": { "type": "string" },
                            "end_datetime": { "type": "string" },
                            "location": { "type": "string" },
                            "description": { "type": "string" }
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
      },
      "/api/privacy-policy": {
        "get": {
          "operationId": "getPrivacyPolicy",
          "summary": "Get Alfa Systems privacy policy",
          "description": "Returns structured privacy policy information including data collection, rights, contact details, and compliance information",
          "responses": {
            "200": {
              "description": "Privacy policy retrieved successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "company": { "type": "string" },
                      "effective_date": { "type": "string" },
                      "version": { "type": "string" },
                      "contact": {
                        "type": "object",
                        "properties": {
                          "email": { "type": "string" },
                          "phone": { "type": "string" },
                          "address": { "type": "string" }
                        }
                      },
                      "sections": {
                        "type": "object",
                        "description": "Detailed privacy policy sections including data collection, rights, security, etc."
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/get-sheet-data": {
        "get": {
          "operationId": "getSheetData",
          "summary": "Get data from Zoho Sheet reporting dashboard",
          "description": "Read-only access to CRM reporting dashboard in Zoho Sheet. The sheet is auto-populated hourly with CRM data for easier filtering and analysis. Use this to answer complex queries that are hard to filter via CRM API.",
          "parameters": [
            {
              "name": "resourceId",
              "in": "query",
              "required": true,
              "schema": {
                "type": "string"
              },
              "description": "The Zoho Sheet resource ID (from the sheet URL). Example: 'tdar2201260c19806490a9eac0aa6e771d83e'"
            },
            {
              "name": "worksheet",
              "in": "query",
              "required": false,
              "schema": {
                "type": "string",
                "default": "Sheet1"
              },
              "description": "The worksheet/tab name to read from. Default: 'Sheet1'"
            },
            {
              "name": "range",
              "in": "query",
              "required": false,
              "schema": {
                "type": "string"
              },
              "description": "Optional cell range to retrieve. Examples: 'N6' (single cell), 'A1:D10' (range). Omit to get all records."
            }
          ],
          "responses": {
            "200": {
              "description": "Sheet data retrieved successfully",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean"
                      },
                      "data": {
                        "type": "object",
                        "description": "Sheet data in Zoho Sheet API format"
                      },
                      "resourceId": {
                        "type": "string"
                      },
                      "worksheet": {
                        "type": "string"
                      },
                      "range": {
                        "type": "string"
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
