
# BotBridge Ops MVP Implementation Guide

## Core Technology Stack

### 1. Microsoft Teams Bot Framework (Primary Integration)
```javascript
// bot.js - Basic Teams Bot Setup
const { TeamsActivityHandler, CardFactory } = require('botbuilder');
const { OpenAI } = require('openai');

class BotBridgeBot extends TeamsActivityHandler {
    constructor() {
        super();
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

        this.onMessage(async (context, next) => {
            await this.handleIncidentReport(context);
            await next();
        });
    }

    async handleIncidentReport(context) {
        const userMessage = context.activity.text;

        // AI-powered incident categorization
        const category = await this.categorizeIncident(userMessage);
        const priority = await this.assessPriority(userMessage, category);

        // Create incident ticket
        const ticket = await this.createTicket({
            description: userMessage,
            category: category,
            priority: priority,
            reporter: context.activity.from.name
        });

        await context.sendActivity(`Incident ${ticket.number} created with ${priority} priority`);
    }

    async categorizeIncident(message) {
        const response = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content: "Categorize IT incidents into: Hardware, Software, Network, Security, or Other"
            }, {
                role: "user", 
                content: message
            }]
        });
        return response.choices[0].message.content;
    }
}

module.exports.BotBridgeBot = BotBridgeBot;
```

### 2. ServiceNow Integration Layer
```javascript
// servicenow-integration.js
class ServiceNowIntegration {
    constructor(instanceUrl, username, password) {
        this.baseURL = `https://${instanceUrl}.service-now.com`;
        this.auth = Buffer.from(`${username}:${password}`).toString('base64');
    }

    async createIncident(incidentData) {
        const response = await fetch(`${this.baseURL}/api/now/table/incident`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${this.auth}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                short_description: incidentData.description,
                category: incidentData.category,
                priority: this.mapPriority(incidentData.priority),
                caller_id: incidentData.reporter,
                state: 1 // New
            })
        });

        return await response.json();
    }

    async updateIncident(incidentId, updates) {
        const response = await fetch(`${this.baseURL}/api/now/table/incident/${incidentId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Basic ${this.auth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });

        return await response.json();
    }

    mapPriority(aiPriority) {
        const priorityMap = {
            'Critical': '1',
            'High': '2', 
            'Medium': '3',
            'Low': '4'
        };
        return priorityMap[aiPriority] || '3';
    }
}
```

### 3. Workflow Automation Engine
```javascript
// workflow-engine.js
class WorkflowEngine {
    constructor() {
        this.rules = this.loadWorkflowRules();
    }

    async processIncident(incident) {
        const applicableRules = this.rules.filter(rule => 
            this.evaluateCondition(rule.condition, incident)
        );

        for (const rule of applicableRules) {
            await this.executeActions(rule.actions, incident);
        }
    }

    evaluateCondition(condition, incident) {
        // Simple rule evaluation - can be enhanced with more complex logic
        if (condition.field === 'priority' && condition.operator === 'equals') {
            return incident.priority === condition.value;
        }
        if (condition.field === 'category' && condition.operator === 'equals') {
            return incident.category === condition.value;
        }
        return false;
    }

    async executeActions(actions, incident) {
        for (const action of actions) {
            switch (action.type) {
                case 'notify_team':
                    await this.notifyTeam(action.team, incident);
                    break;
                case 'escalate':
                    await this.escalateIncident(incident, action.escalation_level);
                    break;
                case 'assign':
                    await this.assignIncident(incident, action.assignee);
                    break;
            }
        }
    }

    loadWorkflowRules() {
        return [
            {
                condition: { field: 'priority', operator: 'equals', value: 'Critical' },
                actions: [
                    { type: 'notify_team', team: 'major_incident_team' },
                    { type: 'escalate', escalation_level: 'manager' }
                ]
            },
            {
                condition: { field: 'category', operator: 'equals', value: 'Security' },
                actions: [
                    { type: 'notify_team', team: 'security_team' },
                    { type: 'assign', assignee: 'security_lead' }
                ]
            }
        ];
    }
}
```

## Deployment Configuration

### 1. Vercel Deployment (serverless.yml)
```yaml
# vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    },
    {
      "src": "public/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ],
  "env": {
    "OPENAI_API_KEY": "@openai-key",
    "SERVICENOW_INSTANCE": "@servicenow-instance",
    "SERVICENOW_USERNAME": "@servicenow-user",
    "SERVICENOW_PASSWORD": "@servicenow-pass",
    "TEAMS_APP_ID": "@teams-app-id",
    "TEAMS_APP_PASSWORD": "@teams-app-password"
  }
}
```

### 2. Environment Configuration
```bash
# .env file
OPENAI_API_KEY=your_openai_api_key
SERVICENOW_INSTANCE=your_instance_name
SERVICENOW_USERNAME=botbridge_user
SERVICENOW_PASSWORD=secure_password
TEAMS_APP_ID=your_teams_app_id
TEAMS_APP_PASSWORD=your_teams_app_password
MONGODB_URI=mongodb://localhost:27017/botbridge
PORT=3000
```

## Database Schema (MongoDB)

### 1. Incident Collection
```javascript
// models/incident.js
const incidentSchema = {
    incidentId: String,
    title: String,
    description: String,
    category: String, // Hardware, Software, Network, Security, Other
    priority: String, // Critical, High, Medium, Low
    status: String,   // New, InProgress, Resolved, Closed
    reporter: {
        name: String,
        email: String,
        teamsId: String
    },
    assignee: {
        name: String,
        email: String,
        team: String
    },
    externalTickets: [{
        system: String, // ServiceNow, Jira, etc.
        ticketId: String,
        url: String
    }],
    timeline: [{
        timestamp: Date,
        action: String,
        user: String,
        details: String
    }],
    aiAnalysis: {
        confidence: Number,
        suggestedActions: [String],
        relatedIncidents: [String]
    },
    createdAt: Date,
    updatedAt: Date,
    resolvedAt: Date
};
```

## Testing Strategy

### 1. Unit Tests
```javascript
// tests/categorization.test.js
const { BotBridgeBot } = require('../bot');

describe('Incident Categorization', () => {
    let bot;

    beforeEach(() => {
        bot = new BotBridgeBot();
    });

    test('should categorize network issues correctly', async () => {
        const message = "The wifi is down in Building A";
        const category = await bot.categorizeIncident(message);
        expect(category).toBe('Network');
    });

    test('should categorize security issues correctly', async () => {
        const message = "Suspicious login attempts detected";
        const category = await bot.categorizeIncident(message);
        expect(category).toBe('Security');
    });
});
```

### 2. Integration Tests
```javascript
// tests/servicenow-integration.test.js
const ServiceNowIntegration = require('../servicenow-integration');

describe('ServiceNow Integration', () => {
    let servicenow;

    beforeEach(() => {
        servicenow = new ServiceNowIntegration('dev12345', 'admin', 'password');
    });

    test('should create incident successfully', async () => {
        const incidentData = {
            description: 'Test incident',
            category: 'Software',
            priority: 'Medium',
            reporter: 'john.doe'
        };

        const result = await servicenow.createIncident(incidentData);
        expect(result.result.number).toBeDefined();
        expect(result.result.state).toBe('1');
    });
});
```

## Monitoring and Analytics

### 1. Performance Metrics Dashboard
```javascript
// analytics/metrics.js
class MetricsCollector {
    constructor() {
        this.metrics = {
            incidentsCreated: 0,
            averageResponseTime: 0,
            automationSuccessRate: 0,
            userSatisfactionScore: 0
        };
    }

    trackIncidentCreation(incident) {
        this.metrics.incidentsCreated++;
        // Track response time from report to assignment
        const responseTime = incident.assignedAt - incident.createdAt;
        this.updateAverageResponseTime(responseTime);
    }

    trackAutomationSuccess(success) {
        // Track success rate of automated actions
        this.updateAutomationSuccessRate(success);
    }

    generateReport() {
        return {
            period: 'Last 30 days',
            metrics: this.metrics,
            trends: this.calculateTrends(),
            recommendations: this.generateRecommendations()
        };
    }
}
```

## Scaling Considerations

1. **Database Scaling**: Consider MongoDB Atlas for production
2. **API Rate Limits**: Implement rate limiting for external API calls
3. **Caching**: Redis for frequently accessed data
4. **Load Balancing**: Use Vercel's automatic load balancing
5. **Error Handling**: Comprehensive error tracking with Sentry
6. **Monitoring**: Application monitoring with Datadog or New Relic

## Security Implementation

1. **Authentication**: OAuth 2.0 for Teams integration
2. **Authorization**: Role-based access control (RBAC)
3. **Data Encryption**: Encrypt sensitive data at rest and in transit
4. **API Security**: API key management and rotation
5. **Audit Logging**: Track all user actions and system changes
