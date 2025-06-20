
// Tab switching functionality
const submitTab = document.getElementById('submitTab');
const dashboardTab = document.getElementById('dashboardTab');
const submitSection = document.getElementById('submitSection');
const dashboardSection = document.getElementById('dashboardSection');

submitTab.addEventListener('click', () => {
    submitTab.classList.add('active');
    dashboardTab.classList.remove('active');
    submitSection.classList.add('active');
    dashboardSection.classList.remove('active');
});

dashboardTab.addEventListener('click', () => {
    dashboardTab.classList.add('active');
    submitTab.classList.remove('active');
    dashboardSection.classList.add('active');
    submitSection.classList.remove('active');
    loadFeedbackData();
});

// Toast notification functionality
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Form submission
const feedbackForm = document.getElementById('feedbackForm');

feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(feedbackForm);
    const feedback = {
        id: Date.now(),
        name: formData.get('name'),
        department: formData.get('department'),
        category: formData.get('category'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        priority: formData.get('priority'),
        timestamp: new Date().toISOString(),
        status: 'new'
    };
    
    // Store in localStorage
    let existingFeedback = JSON.parse(localStorage.getItem('organizationFeedback') || '[]');
    existingFeedback.push(feedback);
    localStorage.setItem('organizationFeedback', JSON.stringify(existingFeedback));
    
    // Show success message
    showToast('Feedback submitted successfully! Thank you for your feedback.');
    
    // Reset form
    feedbackForm.reset();
    document.getElementById('priority').value = 'medium';
});

// Load and display feedback data
function loadFeedbackData() {
    const feedbackList = document.getElementById('feedbackList');
    const feedback = JSON.parse(localStorage.getItem('organizationFeedback') || '[]');
    
    if (feedback.length === 0) {
        feedbackList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #6b7280;">
                <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3 style="margin-bottom: 0.5rem;">No feedback submitted yet</h3>
                <p>Feedback submissions will appear here once they are submitted.</p>
            </div>
        `;
        return;
    }
    
    // Sort by timestamp (newest first)
    feedback.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    feedbackList.innerHTML = feedback.map(item => {
        const date = new Date(item.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const statusClass = `status-${item.status.replace(' ', '-')}`;
        const priorityIcon = getPriorityIcon(item.priority);
        
        return `
            <div class="feedback-item">
                <div class="feedback-header">
                    <div class="feedback-meta">
                        <div class="feedback-name">${item.name}</div>
                        <div class="feedback-department">${item.department}</div>
                        <div class="feedback-date">${date}</div>
                    </div>
                    <div class="feedback-status ${statusClass}">
                        ${item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </div>
                </div>
                <div class="feedback-subject">${item.subject}</div>
                <div class="feedback-message">${item.message}</div>
                <div class="feedback-tags">
                    <span class="feedback-tag">
                        <i class="fas fa-tag"></i> ${item.category}
                    </span>
                    <span class="feedback-tag">
                        ${priorityIcon} ${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

function getPriorityIcon(priority) {
    switch (priority) {
        case 'urgent':
            return '<i class="fas fa-exclamation-triangle" style="color: #dc2626;"></i>';
        case 'high':
            return '<i class="fas fa-arrow-up" style="color: #ea580c;"></i>';
        case 'medium':
            return '<i class="fas fa-minus" style="color: #d97706;"></i>';
        case 'low':
            return '<i class="fas fa-arrow-down" style="color: #16a34a;"></i>';
        default:
            return '<i class="fas fa-star"></i>';
    }
}

// Load feedback data on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add some sample data if none exists
    const existingFeedback = JSON.parse(localStorage.getItem('organizationFeedback') || '[]');
    if (existingFeedback.length === 0) {
        const sampleFeedback = [
            {
                id: 1,
                name: "John Smith",
                department: "Engineering",
                category: "Tools & Technology",
                subject: "Need better development tools",
                message: "The current development environment is slowing down our productivity. We need updated IDEs and faster build tools.",
                priority: "high",
                timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                status: "new"
            },
            {
                id: 2,
                name: "Sarah Johnson",
                department: "HR",
                category: "Work-Life Balance",
                subject: "Flexible working hours request",
                message: "Many employees would benefit from more flexible working hours, especially those with families.",
                priority: "medium",
                timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                status: "in-progress"
            }
        ];
        localStorage.setItem('organizationFeedback', JSON.stringify(sampleFeedback));
    }
});