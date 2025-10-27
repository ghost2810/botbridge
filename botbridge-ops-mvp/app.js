// Data Storage
const appData = {
  incidents: [
    {
      id: 'INC-2025-001',
      title: 'Email server performance degradation',
      description: 'Users reporting slow email response times in Outlook',
      priority: 'High',
      status: 'In Progress',
      category: 'Infrastructure',
      reporter: 'Sarah Johnson',
      assignee: 'Network Operations Team',
      created_at: '2025-10-26T08:30:00Z',
      updated_at: '2025-10-26T09:15:00Z',
      sla_target: '4 hours',
      time_elapsed: '45 minutes'
    },
    {
      id: 'INC-2025-002',
      title: 'VPN connection issues for remote workers',
      description: 'Multiple users unable to connect to VPN',
      priority: 'Critical',
      status: 'Escalated',
      category: 'Network',
      reporter: 'Mike Chen',
      assignee: 'Security Team',
      created_at: '2025-10-26T07:45:00Z',
      updated_at: '2025-10-26T09:20:00Z',
      sla_target: '2 hours',
      time_elapsed: '1 hour 35 minutes'
    },
    {
      id: 'INC-2025-003',
      title: 'Database backup job failed',
      description: 'Nightly backup job for customer database failed',
      priority: 'Medium',
      status: 'Resolved',
      category: 'Database',
      reporter: 'System Monitor',
      assignee: 'Database Team',
      created_at: '2025-10-25T23:30:00Z',
      updated_at: '2025-10-26T06:15:00Z',
      sla_target: '8 hours',
      time_elapsed: '6 hours 45 minutes'
    }
  ],
  teams: [
    {
      name: 'Network Operations',
      members: 8,
      active_incidents: 3,
      avg_resolution_time: '3.2 hours'
    },
    {
      name: 'Security Team',
      members: 5,
      active_incidents: 2,
      avg_resolution_time: '1.8 hours'
    },
    {
      name: 'Database Team',
      members: 4,
      active_incidents: 1,
      avg_resolution_time: '4.1 hours'
    },
    {
      name: 'Application Support',
      members: 12,
      active_incidents: 2,
      avg_resolution_time: '2.7 hours'
    }
  ],
  workflows: [
    {
      name: 'Critical Incident Auto-Escalation',
      trigger: 'Priority = Critical',
      actions: [
        'Notify Major Incident Manager',
        'Create ServiceNow ticket',
        'Send SMS to on-call engineer'
      ],
      success_rate: '95%'
    },
    {
      name: 'Security Incident Routing',
      trigger: 'Category = Security',
      actions: [
        'Route to Security Team',
        'Create Jira ticket',
        'Enable enhanced monitoring'
      ],
      success_rate: '88%'
    },
    {
      name: 'Automated Password Reset',
      trigger: 'Description contains "password reset"',
      actions: [
        'Trigger automated reset process',
        'Send instructions to user',
        'Close ticket if successful'
      ],
      success_rate: '92%'
    }
  ],
  integrations: [
    {
      name: 'ServiceNow',
      status: 'Connected',
      sync_status: 'Active',
      last_sync: '2025-10-26T09:20:00Z',
      tickets_synced: 1247
    },
    {
      name: 'Microsoft Teams',
      status: 'Connected',
      sync_status: 'Active',
      last_sync: '2025-10-26T09:22:00Z',
      messages_processed: 89
    },
    {
      name: 'Jira Service Desk',
      status: 'Connected',
      sync_status: 'Active',
      last_sync: '2025-10-26T09:18:00Z',
      tickets_synced: 456
    },
    {
      name: 'Azure Monitor',
      status: 'Connected',
      sync_status: 'Active',
      last_sync: '2025-10-26T09:25:00Z',
      alerts_processed: 23
    }
  ]
};

// Navigation
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const viewName = item.getAttribute('data-view');
      
      // Update active nav item
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Update active view
      views.forEach(view => view.classList.remove('active'));
      const targetView = document.getElementById(`${viewName}-view`);
      if (targetView) {
        targetView.classList.add('active');
      }
    });
  });
}

// Render Incident Feed
function renderIncidentFeed() {
  const feedContainer = document.getElementById('incidentFeed');
  if (!feedContainer) return;

  const activeIncidents = appData.incidents.filter(inc => inc.status !== 'Resolved');
  
  feedContainer.innerHTML = activeIncidents.map(incident => `
    <div class="incident-item">
      <span class="priority-badge ${incident.priority.toLowerCase()}">${incident.priority}</span>
      <div class="incident-info">
        <div class="incident-title">${incident.title}</div>
        <div class="incident-meta">${incident.id} • ${incident.assignee}</div>
      </div>
      <div class="incident-time">${incident.time_elapsed}</div>
    </div>
  `).join('');
}

// Render Integration List
function renderIntegrationList() {
  const listContainer = document.getElementById('integrationList');
  if (!listContainer) return;

  listContainer.innerHTML = appData.integrations.map(integration => `
    <div class="integration-item">
      <div class="integration-info">
        <div class="integration-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
        </div>
        <span class="integration-name">${integration.name}</span>
      </div>
      <span class="integration-status">Active</span>
    </div>
  `).join('');
}

// Render Team Grid
function renderTeamGrid() {
  const gridContainer = document.getElementById('teamGrid');
  if (!gridContainer) return;

  gridContainer.innerHTML = appData.teams.map(team => `
    <div class="team-card">
      <div class="team-name">${team.name}</div>
      <div class="team-stats">
        <div class="team-stat">
          <span class="team-stat-label">Members:</span>
          <span class="team-stat-value">${team.members}</span>
        </div>
        <div class="team-stat">
          <span class="team-stat-label">Active Incidents:</span>
          <span class="team-stat-value">${team.active_incidents}</span>
        </div>
        <div class="team-stat">
          <span class="team-stat-label">Avg Resolution:</span>
          <span class="team-stat-value">${team.avg_resolution_time}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Render Incident Table
function renderIncidentTable() {
  const tableContainer = document.getElementById('incidentTable');
  if (!tableContainer) return;

  const statusClass = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  tableContainer.innerHTML = `
    <table class="incident-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Priority</th>
          <th>Status</th>
          <th>Category</th>
          <th>Assignee</th>
          <th>Time Elapsed</th>
        </tr>
      </thead>
      <tbody>
        ${appData.incidents.map(incident => `
          <tr>
            <td><strong>${incident.id}</strong></td>
            <td>${incident.title}</td>
            <td><span class="priority-badge ${incident.priority.toLowerCase()}">${incident.priority}</span></td>
            <td><span class="status-badge ${statusClass(incident.status)}">${incident.status}</span></td>
            <td>${incident.category}</td>
            <td>${incident.assignee}</td>
            <td>${incident.time_elapsed}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// Render Workflows
function renderWorkflows() {
  const workflowsContainer = document.getElementById('workflowsList');
  if (!workflowsContainer) return;

  workflowsContainer.innerHTML = appData.workflows.map(workflow => `
    <div class="workflow-card">
      <div class="workflow-header">
        <div>
          <div class="workflow-title">${workflow.name}</div>
          <span class="workflow-trigger">${workflow.trigger}</span>
        </div>
      </div>
      <div class="workflow-actions">
        ${workflow.actions.map(action => `
          <div class="action-item">${action}</div>
        `).join('')}
      </div>
      <div class="workflow-footer">
        <span class="success-rate">Success Rate: <span class="success-rate-value">${workflow.success_rate}</span></span>
        <button class="btn btn--sm btn--outline">Edit</button>
      </div>
    </div>
  `).join('');
}

// Render Integration Settings
function renderIntegrationSettings() {
  const settingsContainer = document.getElementById('integrationSettings');
  if (!settingsContainer) return;

  settingsContainer.innerHTML = appData.integrations.map(integration => `
    <div class="integration-setting">
      <div>
        <div class="integration-name">${integration.name}</div>
        <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: 4px;">
          Last sync: ${new Date(integration.last_sync).toLocaleString()}
        </div>
      </div>
      <button class="btn btn--sm btn--outline">Configure</button>
    </div>
  `).join('');
}

// Initialize Charts
function initCharts() {
  // Incident Volume Chart
  const volumeCanvas = document.getElementById('incidentVolumeChart');
  if (volumeCanvas) {
    const volumeData = [
      { date: '2025-10-20', incidents: 45 },
      { date: '2025-10-21', incidents: 38 },
      { date: '2025-10-22', incidents: 52 },
      { date: '2025-10-23', incidents: 41 },
      { date: '2025-10-24', incidents: 36 },
      { date: '2025-10-25', incidents: 43 },
      { date: '2025-10-26', incidents: 28 }
    ];

    new Chart(volumeCanvas, {
      type: 'line',
      data: {
        labels: volumeData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
          label: 'Incidents',
          data: volumeData.map(d => d.incidents),
          borderColor: 'rgb(33, 128, 141)',
          backgroundColor: 'rgba(33, 128, 141, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              precision: 0
            }
          }
        }
      }
    });
  }

  // Resolution Time Chart
  const resolutionCanvas = document.getElementById('resolutionTimeChart');
  if (resolutionCanvas) {
    const resolutionData = [
      { date: '2025-10-20', avg_time: 3.8 },
      { date: '2025-10-21', avg_time: 2.9 },
      { date: '2025-10-22', avg_time: 4.1 },
      { date: '2025-10-23', avg_time: 2.7 },
      { date: '2025-10-24', avg_time: 2.4 },
      { date: '2025-10-25', avg_time: 2.8 },
      { date: '2025-10-26', avg_time: 2.3 }
    ];

    new Chart(resolutionCanvas, {
      type: 'bar',
      data: {
        labels: resolutionData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
        datasets: [{
          label: 'Hours',
          data: resolutionData.map(d => d.avg_time),
          backgroundColor: 'rgba(33, 128, 141, 0.8)',
          borderColor: 'rgb(33, 128, 141)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}

// Modal Functions
function showCreateIncidentModal() {
  const modal = document.getElementById('createIncidentModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeCreateIncidentModal() {
  const modal = document.getElementById('createIncidentModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function handleCreateIncident(event) {
  event.preventDefault();
  
  // Get form values
  const form = event.target;
  const formData = new FormData(form);
  
  // Simulate incident creation
  alert('Incident created successfully! AI automation has been triggered for routing and notification.');
  
  closeCreateIncidentModal();
  form.reset();
}

// Simulate real-time updates
function simulateRealtimeUpdates() {
  setInterval(() => {
    const feedContainer = document.getElementById('incidentFeed');
    if (feedContainer && feedContainer.offsetParent !== null) {
      // Update time elapsed for incidents
      const timeElements = feedContainer.querySelectorAll('.incident-time');
      timeElements.forEach((elem, index) => {
        if (appData.incidents[index] && appData.incidents[index].status !== 'Resolved') {
          // This would update in real implementation
        }
      });
    }
  }, 30000); // Update every 30 seconds
}

// Initialize Application
function initApp() {
  initNavigation();
  renderIncidentFeed();
  renderIntegrationList();
  renderTeamGrid();
  renderIncidentTable();
  renderWorkflows();
  renderIntegrationSettings();
  initCharts();
  simulateRealtimeUpdates();
}

// Run initialization when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}