import { Component, useState, useRef, onWillStart, onMounted } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

class HospitalDashboard extends Component {
    setup() {
        super.setup();

        this.orm = useService("orm");
        this.action = useService("action");

        this.genderChartRef = useRef("genderChartCanvas");

        this.state = useState({
            stats: {
                total_patients: 0,
                male_patients: 0,
                female_patients: 0
            },
            isLoading: true
        });

        onMounted(async () => {
            await this.fetchDashboardData();
            this.renderGenderChart();
        });
    }

    async fetchDashboardData() {
        this.state.isLoading = true;
        try {
            const result = await this.orm.call("hospital.patient", "get_dashboard_data", []);
            this.state.stats = result;
        } catch(error) {
            console.error("Failed to fetche dashboard data: ", error);
        } finally {
            this.state.isLoading = false;
        }
    }

    renderGenderChart() {
        if(!this.genderChartRef.el) return;

        if(typeof Chart === "undefined") {
            console.error("Chart.js is not loaded from CDN");
            return;
        }

        const ctx = this.genderChartRef.el.getContext('2d');

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Male Patients', 'Female Patients'],
                datasets: [{
                    label: 'Gender Stats',
                    data: [this.state.stats.male_patients, this.state.stats.female_patients],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    }
                }
            }
        })
    }

    openView(resModel, domain, name) {
        this.action.doAction({
            type: "ir.actions.act_window",
            name: name,
            res_model: resModel,
            domain: domain,
            views: [[false, "list"], [false, "form"]],
            target: "current"
        })
    }
}

HospitalDashboard.template = "medicare_hms.HospitalDashboardTemplate";
registry.category("actions").add("hospital_dashboard_action", HospitalDashboard);