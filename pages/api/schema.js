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
      "description": "Search contacts and leads, view notes, send emails, and view attachments in Zoho CRM"
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
      }
    }
  };

  return res.status(200).json(schema);
}
