openapi: 3.0.0
info:
  title: Tiffin Management System - Settings, CMS, Versions, Backups & Maintenance API
  description: |
    Complete API documentation for System Settings, CMS Pages, App Version Management,
    System Backups, and Maintenance Mode.
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

    PaginatedResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        data:
          type: array
          items:
            $ref: '#/components/schemas/SystemSetting'
        meta:
          $ref: '#/components/schemas/PaginationMeta'

    PaginationMeta:
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

    SystemSetting:
      type: object
      properties:
        uuid:
          type: string
          format: uuid
        setting_group:
          type: string
          example: general
        setting_key:
          type: string
          example: site_name
        setting_value:
          type: string
          nullable: true
          example: TiffinApp
        data_type:
          type: string
          enum: [string, integer, float, boolean, json, text]
          example: string
        is_encrypted:
          type: boolean
          example: false
        autoload:
          type: boolean
          example: true
        status:
          type: string
          enum: [active, inactive]
          example: active
        remarks:
          type: string
          nullable: true
        updated_by:
          type: integer
          nullable: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    StoreSystemSettingRequest:
      type: object
      required: [setting_group, setting_key, setting_value, data_type]
      properties:
        setting_group:
          type: string
          example: general
        setting_key:
          type: string
          example: site_name
        setting_value:
          type: string
          nullable: true
          example: TiffinApp
        data_type:
          type: string
          enum: [string, integer, float, boolean, json, text]
          example: string
        is_encrypted:
          type: boolean
          default: false
        autoload:
          type: boolean
          default: true
        status:
          type: string
          enum: [active, inactive]
          default: active
        remarks:
          type: string
          nullable: true

    UpdateSystemSettingRequest:
      type: object
      properties:
        setting_value:
          type: string
          nullable: true
        data_type:
          type: string
          enum: [string, integer, float, boolean, json, text]
        is_encrypted:
          type: boolean
        autoload:
          type: boolean
        status:
          type: string
          enum: [active, inactive]
        remarks:
          type: string
          nullable: true

    BulkUpdateRequest:
      type: object
      required: [settings]
      properties:
        settings:
          type: array
          items:
            type: object
            required: [setting_key, setting_value]
            properties:
              setting_key:
                type: string
              setting_value:
                type: string
                nullable: true

    CmsPage:
      type: object
      properties:
        uuid:
          type: string
          format: uuid
        page_code:
          type: string
          example: PRIVACY
        page_title:
          type: string
          example: Privacy Policy
        slug:
          type: string
          example: privacy-policy
        content:
          type: string
          example: '<p>Privacy policy content</p>'
        meta_title:
          type: string
          nullable: true
        meta_description:
          type: string
          nullable: true
        meta_keywords:
          type: string
          nullable: true
        status:
          type: string
          enum: [draft, published, archived]
          example: draft
        published_at:
          type: string
          format: date-time
          nullable: true
        created_by:
          type: integer
          nullable: true
        updated_by:
          type: integer
          nullable: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    StoreCmsPageRequest:
      type: object
      required: [page_code, page_title, slug, content]
      properties:
        page_code:
          type: string
          example: PRIVACY
        page_title:
          type: string
          example: Privacy Policy
        slug:
          type: string
          example: privacy-policy
        content:
          type: string
          example: '<p>Privacy policy content</p>'
        meta_title:
          type: string
          nullable: true
        meta_description:
          type: string
          nullable: true
        meta_keywords:
          type: string
          nullable: true
        status:
          type: string
          enum: [draft, published, archived]
          default: draft

    UpdateCmsPageRequest:
      type: object
      properties:
        page_title:
          type: string
        slug:
          type: string
        content:
          type: string
        meta_title:
          type: string
          nullable: true
        meta_description:
          type: string
          nullable: true
        meta_keywords:
          type: string
          nullable: true
        status:
          type: string
          enum: [draft, published, archived]

    AppVersion:
      type: object
      properties:
        uuid:
          type: string
          format: uuid
        platform:
          type: string
          enum: [android, ios, web]
          example: android
        version_name:
          type: string
          example: 1.2.0
        version_code:
          type: integer
          example: 12
        minimum_supported_version:
          type: string
          nullable: true
          example: 1.0.0
        force_update:
          type: boolean
          example: false
        release_notes:
          type: string
          nullable: true
          example: Bug fixes and improvements
        status:
          type: string
          enum: [active, inactive, deprecated]
          example: active
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    StoreAppVersionRequest:
      type: object
      required: [platform, version_name, version_code]
      properties:
        platform:
          type: string
          enum: [android, ios, web]
        version_name:
          type: string
          example: 1.2.0
        version_code:
          type: integer
          example: 12
        minimum_supported_version:
          type: string
          nullable: true
        force_update:
          type: boolean
          default: false
        release_notes:
          type: string
          nullable: true
        status:
          type: string
          enum: [active, inactive, deprecated]
          default: active

    UpdateAppVersionRequest:
      type: object
      properties:
        version_name:
          type: string
        version_code:
          type: integer
        minimum_supported_version:
          type: string
          nullable: true
        force_update:
          type: boolean
        release_notes:
          type: string
          nullable: true
        status:
          type: string
          enum: [active, inactive, deprecated]

    SystemBackup:
      type: object
      properties:
        uuid:
          type: string
          format: uuid
        backup_name:
          type: string
          example: Daily Backup
        backup_type:
          type: string
          enum: [database, storage, full]
          example: database
        file_path:
          type: string
          nullable: true
          example: backups/daily_20260726.sql
        file_size:
          type: integer
          nullable: true
          example: 1024000
        status:
          type: string
          enum: [pending, in_progress, completed, failed]
          example: completed
        started_at:
          type: string
          format: date-time
          nullable: true
        completed_at:
          type: string
          format: date-time
          nullable: true
        error_message:
          type: string
          nullable: true
        created_by:
          type: integer
          nullable: true
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    CreateBackupRequest:
      type: object
      required: [backup_name, backup_type]
      properties:
        backup_name:
          type: string
          example: Weekly Full Backup
        backup_type:
          type: string
          enum: [database, storage, full]

    MaintenanceStatus:
      type: object
      properties:
        is_enabled:
          type: boolean
          example: false
        enabled_at:
          type: string
          format: date-time
          nullable: true
        maintenance_file_exists:
          type: boolean
          example: false

  responses:
    Unauthorized:
      description: Unauthenticated access
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            message: Unauthenticated.

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
          example:
            success: false
            message: Resource not found.

    ValidationFailed:
      description: Validation error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'

tags:
  - name: System Settings
    description: System configuration settings management
  - name: CMS Pages
    description: Content management system for static pages
  - name: App Versions
    description: Mobile/web app version management
  - name: System Backups
    description: Database and storage backup management
  - name: Maintenance
    description: Application maintenance mode control

paths:
  # ===== SYSTEM SETTINGS =====
  /admin/settings:
    get:
      tags: [System Settings]
      summary: List all system settings
      description: Retrieve paginated list of system settings with optional filters
      security:
        - bearerAuth: []
      parameters:
        - name: group
          in: query
          schema:
            type: string
          description: Filter by setting group
        - name: status
          in: query
          schema:
            type: string
            enum: [active, inactive]
        - name: data_type
          in: query
          schema:
            type: string
            enum: [string, integer, float, boolean, json, text]
        - name: is_encrypted
          in: query
          schema:
            type: boolean
        - name: search
          in: query
          schema:
            type: string
        - name: per_page
          in: query
          schema:
            type: integer
            default: 25
        - name: sort
          in: query
          schema:
            type: string
            default: setting_key
        - name: order
          in: query
          schema:
            type: string
            enum: [asc, desc]
            default: asc
      responses:
        '200':
          description: Paginated settings list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'

    post:
      tags: [System Settings]
      summary: Create a new system setting
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/StoreSystemSettingRequest'
      responses:
        '201':
          description: Setting created
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: System setting created successfully
                  data:
                    $ref: '#/components/schemas/SystemSetting'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/ValidationFailed'

  /admin/settings/groups:
    get:
      tags: [System Settings]
      summary: Get setting groups and status counts
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Groups and status counts
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      groups:
                        type: object
                        additionalProperties:
                          type: integer
                        example:
                          general: 10
                          payment: 5
                          notification: 3
                      status_counts:
                        type: object
                        additionalProperties:
                          type: integer
                        example:
                          active: 15
                          inactive: 3

  /admin/settings/group/{group}:
    get:
      tags: [System Settings]
      summary: Get settings by group
      security:
        - bearerAuth: []
      parameters:
        - name: group
          in: path
          required: true
          schema:
            type: string
          example: general
      responses:
        '200':
          description: Settings in group
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/SystemSetting'

  /admin/settings/{uuid}:
    get:
      tags: [System Settings]
      summary: Get a single setting by UUID
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Setting details
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    $ref: '#/components/schemas/SystemSetting'
        '404':
          $ref: '#/components/responses/NotFound'

    put:
      tags: [System Settings]
      summary: Update a system setting
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateSystemSettingRequest'
      responses:
        '200':
          description: Setting updated
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/ValidationFailed'

    delete:
      tags: [System Settings]
      summary: Delete a system setting
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Setting deleted
        '404':
          $ref: '#/components/responses/NotFound'

  /admin/settings/bulk-update:
    patch:
      tags: [System Settings]
      summary: Bulk update multiple settings
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BulkUpdateRequest'
      responses:
        '200':
          description: Settings bulk updated

  # ===== CMS PAGES =====
  /admin/cms-pages:
    get:
      tags: [CMS Pages]
      summary: List all CMS pages
      security:
        - bearerAuth: []
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [draft, published, archived]
        - name: page_code
          in: query
          schema:
            type: string
        - name: search
          in: query
          schema:
            type: string
        - name: per_page
          in: query
          schema:
            type: integer
            default: 25
        - name: sort
          in: query
          schema:
            type: string
            default: created_at
        - name: order
          in: query
          schema:
            type: string
            enum: [asc, desc]
            default: desc
      responses:
        '200':
          description: Paginated CMS pages list
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/CmsPage'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'

    post:
      tags: [CMS Pages]
      summary: Create a new CMS page
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/StoreCmsPageRequest'
      responses:
        '201':
          description: CMS page created
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/ValidationFailed'

  /admin/cms-pages/stats:
    get:
      tags: [CMS Pages]
      summary: Get CMS page statistics
      security:
        - bearerAuth: []
      responses:
        '200':
          description: CMS page stats
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      status_counts:
                        type: object
                        additionalProperties:
                          type: integer
                      total:
                        type: integer

  /admin/cms-pages/public/{slug}:
    get:
      tags: [CMS Pages]
      summary: Get a published CMS page by slug (public)
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
          example: privacy-policy
      responses:
        '200':
          description: Published CMS page
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    $ref: '#/components/schemas/CmsPage'
        '404':
          $ref: '#/components/responses/NotFound'

  /admin/cms-pages/{uuid}:
    get:
      tags: [CMS Pages]
      summary: Get a single CMS page by UUID
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: CMS page details
        '404':
          $ref: '#/components/responses/NotFound'

    put:
      tags: [CMS Pages]
      summary: Update a CMS page
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateCmsPageRequest'
      responses:
        '200':
          description: CMS page updated
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags: [CMS Pages]
      summary: Delete a CMS page
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: CMS page deleted
        '404':
          $ref: '#/components/responses/NotFound'

  /admin/cms-pages/{uuid}/publish:
    patch:
      tags: [CMS Pages]
      summary: Publish a CMS page
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: CMS page published
        '404':
          $ref: '#/components/responses/NotFound'

  /admin/cms-pages/{uuid}/archive:
    patch:
      tags: [CMS Pages]
      summary: Archive a CMS page
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: CMS page archived
        '404':
          $ref: '#/components/responses/NotFound'

  # ===== APP VERSIONS =====
  /admin/app-versions:
    get:
      tags: [App Versions]
      summary: List all app versions
      security:
        - bearerAuth: []
      parameters:
        - name: platform
          in: query
          schema:
            type: string
            enum: [android, ios, web]
        - name: status
          in: query
          schema:
            type: string
            enum: [active, inactive, deprecated]
        - name: search
          in: query
          schema:
            type: string
        - name: per_page
          in: query
          schema:
            type: integer
            default: 25
        - name: sort
          in: query
          schema:
            type: string
            default: version_code
        - name: order
          in: query
          schema:
            type: string
            enum: [asc, desc]
            default: desc
      responses:
        '200':
          description: Paginated versions list
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/AppVersion'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'

    post:
      tags: [App Versions]
      summary: Create a new app version
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/StoreAppVersionRequest'
      responses:
        '201':
          description: App version created
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/ValidationFailed'

  /admin/app-versions/stats:
    get:
      tags: [App Versions]
      summary: Get version statistics by platform and status
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Version stats
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      platform_counts:
                        type: object
                        additionalProperties:
                          type: integer
                        example:
                          android: 5
                          ios: 3
                          web: 2
                      status_counts:
                        type: object
                        additionalProperties:
                          type: integer

  /admin/app-versions/latest/{platform}:
    get:
      tags: [App Versions]
      summary: Get the latest active version for a platform
      security:
        - bearerAuth: []
      parameters:
        - name: platform
          in: path
          required: true
          schema:
            type: string
            enum: [android, ios, web]
      responses:
        '200':
          description: Latest version for platform
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    $ref: '#/components/schemas/AppVersion'
        '404':
          description: No version found for platform

  /admin/app-versions/check-outdated:
    post:
      tags: [App Versions]
      summary: Check if a client version is outdated
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [platform, current_version]
              properties:
                platform:
                  type: string
                  enum: [android, ios, web]
                current_version:
                  type: string
                  example: "1.0.0"
      responses:
        '200':
          description: Outdated check result
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      is_outdated:
                        type: boolean
                      latest_version:
                        $ref: '#/components/schemas/AppVersion'
                        nullable: true
                      force_update:
                        type: boolean

  /admin/app-versions/{uuid}:
    get:
      tags: [App Versions]
      summary: Get a single app version by UUID
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Version details
        '404':
          $ref: '#/components/responses/NotFound'

    put:
      tags: [App Versions]
      summary: Update an app version
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateAppVersionRequest'
      responses:
        '200':
          description: Version updated
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags: [App Versions]
      summary: Delete an app version
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Version deleted
        '404':
          $ref: '#/components/responses/NotFound'

  /admin/app-versions/{uuid}/status:
    patch:
      tags: [App Versions]
      summary: Set the status of an app version
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [status]
              properties:
                status:
                  type: string
                  enum: [active, inactive, deprecated]
      responses:
        '200':
          description: Status updated
        '404':
          $ref: '#/components/responses/NotFound'

  # ===== SYSTEM BACKUPS =====
  /admin/backups:
    get:
      tags: [System Backups]
      summary: List all backups
      security:
        - bearerAuth: []
      parameters:
        - name: backup_type
          in: query
          schema:
            type: string
            enum: [database, storage, full]
        - name: status
          in: query
          schema:
            type: string
            enum: [pending, in_progress, completed, failed]
        - name: search
          in: query
          schema:
            type: string
        - name: per_page
          in: query
          schema:
            type: integer
            default: 25
        - name: sort
          in: query
          schema:
            type: string
            default: created_at
        - name: order
          in: query
          schema:
            type: string
            enum: [asc, desc]
            default: desc
      responses:
        '200':
          description: Paginated backups list
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/SystemBackup'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'

    post:
      tags: [System Backups]
      summary: Create a new backup
      description: Initiates a backup job. The backup runs asynchronously via queue.
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateBackupRequest'
      responses:
        '201':
          description: Backup initiated
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/ValidationFailed'

  /admin/backups/stats:
    get:
      tags: [System Backups]
      summary: Get backup statistics
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Backup stats
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                    properties:
                      status_counts:
                        type: object
                        additionalProperties:
                          type: integer
                      type_counts:
                        type: object
                        additionalProperties:
                          type: integer
                      total_size:
                        type: integer
                        description: Total size in bytes

  /admin/backups/{uuid}:
    get:
      tags: [System Backups]
      summary: Get a single backup by UUID
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Backup details
        '404':
          $ref: '#/components/responses/NotFound'

    delete:
      tags: [System Backups]
      summary: Delete a backup
      security:
        - bearerAuth: []
      parameters:
        - name: uuid
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Backup deleted
        '404':
          $ref: '#/components/responses/NotFound'

  # ===== MAINTENANCE MODE =====
  /admin/maintenance/enable:
    post:
      tags: [Maintenance]
      summary: Enable maintenance mode
      description: Puts the application into maintenance mode with a secret bypass token.
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Maintenance mode enabled
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  message:
                    type: string
                    example: Maintenance mode enabled successfully

  /admin/maintenance/disable:
    post:
      tags: [Maintenance]
      summary: Disable maintenance mode
      description: Takes the application out of maintenance mode.
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Maintenance mode disabled
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  message:
                    type: string
                    example: Maintenance mode disabled successfully

  /admin/maintenance/status:
    get:
      tags: [Maintenance]
      summary: Get current maintenance mode status
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Current maintenance status
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    $ref: '#/components/schemas/MaintenanceStatus'
