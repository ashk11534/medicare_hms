import { Component, useState, onWillStart } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

class HospitalDashboard extends Component {
    setup() {
        super.setup();

        this.orm = useService("orm");
        this.action = useService("action");

        this.state = useState({
            stats: {
                total_patients: 0,
                male_patients: 0,
                female_patients: 0
            },
            isLoading: true
        });

        onWillStart(async () => {
            await this.fetchDashboardData();
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