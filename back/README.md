# FastAPI Application

A simple FastAPI application template.

## Setup

1. Create and activate virtual environment:

```bash
uv venv
source .venv/bin/activate  # On Unix/macOS
# or
.\.venv\Scripts\activate  # On Windows
```

1. Install dependencies:

```bash
# Install production dependencies
uv sync

# Install development dependencies (optional)
uv sync --dev
```

## Running the Application

Start the server:

```bash
uv run main.py
```

The application will be available at <http://localhost:8000>

## API Documentation

- Interactive API docs (Swagger UI): <http://localhost:8000/docs>
- Alternative API docs (ReDoc): <http://localhost:8000/redoc>

## Project Structure

```
.
├── README.md
├── main.py              # Main application file
├── pyproject.toml       # Project configuration and dependencies
└── .venv/              # Virtual environment (not in version control)
```

## Development

To add new dependencies:

```bash
# Add production dependencies
uv add package-name

# Add development dependencies
uv add --dev package-name
```
