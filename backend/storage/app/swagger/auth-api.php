openapi: 3.0.0
info:
  title: Tiffin Management System - Auth & RBAC API
  description: Complete authentication and RBAC API documentation
  version: 1.0.0
  contact:
    name: API Support
    email: support@tiffin.local

servers:
  - url: http://localhost:8000/api/v1
    description: Local Development

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    SuccessResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        message:
          type: string
        data:
          type: object

    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          example: false
        message:
          type: string
        errors:
          type: object

    LoginRequest:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
          example: admin@tiffin.local
        password:
          type: string
          example: Admin@1234
        remember_me:
          type: boolean
          default: false

    LoginResponse:
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
        data:
          type: object
          properties:
            token:
              type: string
            admin:
              type: object
              properties:
                id:
                  type: integer
                uuid:
                  type: string
                first_name:
                  type: string
                last_name:
                  type: string
                email:
                  type: string
                status:
                  type: string
            abilities:
              type: array
              items:
                type: string

    AdminUser:
      type: object
      properties:
        id:
          type: integer
        uuid:
          type: string
        first_name:
          type: string
        last_name:
          type: string
        full_name:
          type: string
        email:
          type: string
        mobile:
          type: string
        status:
          type: string
        roles:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
        created_at:
          type: string
          format: date-time

    Role:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        display_name:
          type: string
        description:
          type: string
        permissions:
          type: array
          items:
            type: object
            properties:
              id:
                type: integer
              name:
                type: string
        admins_count:
          type: integer

    Permission:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        display_name:
          type: string
        group:
          type: string

    PaginatedResponse:
      type: object
      properties:
        success:
          type: boolean
        message:
          type: string
        data:
          type: array
        meta:
          type: object
          properties:
            current_page:
              type: integer
            last_page:
              type: integer
            per_page:
              type: integer
            total:
              type: integer

paths:
  /admin/login:
    post:
      tags: [Authentication]
      summary: Admin Login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/LoginResponse'
        '401':
          description: Invalid credentials
        '422':
          description: Validation error
        '423':
          description: Account locked

  /admin/logout:
    post:
      tags: [Authentication]
      summary: Admin Logout
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Logged out successfully

  /admin/forgot-password:
    post:
      tags: [Authentication]
      summary: Forgot Password
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email]
              properties:
                email:
                  type: string
                  format: email
      responses:
        '200':
          description: Reset link sent

  /admin/reset-password:
    post:
      tags: [Authentication]
      summary: Reset Password
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [token, email, password]
              properties:
                token:
                  type: string
                email:
                  type: string
                password:
                  type: string
                password_confirmation:
                  type: string
      responses:
        '200':
          description: Password reset successfully

  /admin/change-password:
    post:
      tags: [Authentication]
      summary: Change Password
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [current_password, password]
              properties:
                current_password:
                  type: string
                password:
                  type: string
                password_confirmation:
                  type: string
      responses:
        '200':
          description: Password changed

  /admin/profile:
    get:
      tags: [Profile]
      summary: Get Profile
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Profile retrieved
    put:
      tags: [Profile]
      summary: Update Profile
      security:
        - bearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                first_name:
                  type: string
                last_name:
                  type: string
                email:
                  type: string
                mobile:
                  type: string
      responses:
        '200':
          description: Profile updated

  /admin/admin-users:
    get:
      tags: [Admin Users]
      summary: List Admin Users
      security:
        - bearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
        - name: per_page
          in: query
          schema:
            type: integer
        - name: search
          in: query
          schema:
            type: string
        - name: sort
          in: query
          schema:
            type: string
        - name: order
          in: query
          schema:
            type: string
            enum: [asc, desc]
      responses:
        '200':
          description: Admin users retrieved
    post:
      tags: [Admin Users]
      summary: Create Admin User
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [first_name, last_name, email, password, role_id]
              properties:
                first_name:
                  type: string
                last_name:
                  type: string
                email:
                  type: string
                mobile:
                  type: string
                password:
                  type: string
                password_confirmation:
                  type: string
                role_id:
                  type: integer
                status:
                  type: string
      responses:
        '201':
          description: Admin created
        '422':
          description: Validation error

  /admin/roles:
    get:
      tags: [Roles]
      summary: List Roles
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Roles retrieved
    post:
      tags: [Roles]
      summary: Create Role
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name]
              properties:
                name:
                  type: string
                display_name:
                  type: string
                description:
                  type: string
                permission_ids:
                  type: array
                  items:
                    type: integer
      responses:
        '201':
          description: Role created

  /admin/permissions:
    get:
      tags: [Permissions]
      summary: List Permissions
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Permissions retrieved
