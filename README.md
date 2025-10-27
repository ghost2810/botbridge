# BotBridge

Your Tools! Your Intelligence!!

## Description

BotBridge is a FastAPI-based application designed to bridge your tools with intelligent automation capabilities.

## Features

- FastAPI framework for high-performance API development
- CORS support for cross-origin requests
- Health check endpoint for monitoring
- Structured and scalable architecture

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ghost2810/botbridge.git
cd botbridge
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

### Method 1: Using Python directly
```bash
python main.py
```

### Method 2: Using Uvicorn
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The application will be available at:
- API: http://localhost:8000
- Interactive API documentation (Swagger UI): http://localhost:8000/docs
- Alternative API documentation (ReDoc): http://localhost:8000/redoc

## API Endpoints

### Root Endpoint
- **GET** `/`
  - Returns welcome message and API status

### Health Check
- **GET** `/health`
  - Returns health status of the application

## Project Structure

```
botbridge/
├── main.py              # FastAPI application entry point
├── requirements.txt     # Python dependencies
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Development

To run in development mode with auto-reload:
```bash
uvicorn main:app --reload
```

## Contributing

Feel free to open issues or submit pull requests for improvements.

## License

MIT License
