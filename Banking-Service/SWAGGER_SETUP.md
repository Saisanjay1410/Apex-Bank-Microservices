# Swagger / OpenAPI Setup

The project uses `springdoc-openapi-starter-webmvc-ui` to expose Swagger UI.

## Start the application

Make sure the database is available and set the required environment variables:

- `DB_PASSWORD`
- `JWT_SECRET` (at least 32 characters)

Then run the Spring Boot application.

## Open Swagger UI

Open:

`http://localhost:8081/swagger-ui.html`

OpenAPI JSON:

`http://localhost:8081/v3/api-docs`

## Test authenticated APIs

1. Open `POST /auth/register` and create a user.
2. Open `POST /auth/login` and log in.
3. Copy the `token` from the response.
4. Click **Authorize** in the Swagger UI.
5. Enter the JWT token in the value field. Swagger's bearer security scheme automatically sends it as:

   `Authorization: Bearer <token>`

6. Click **Authorize**, close the dialog, and test `/employees`, `/accounts`, and `/transactions`.

The Swagger and OpenAPI endpoints are explicitly permitted by Spring Security.
