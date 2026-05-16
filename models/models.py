from odoo import models, fields, api, _
from odoo.exceptions import ValidationError
import logging

logger = logging.getLogger('__name__')


class HospitalPatient(models.Model):
    _name = 'hospital.patient'
    _description = 'hospital.patient'
    _order = 'id desc'

    name = fields.Char(string='Name', required=True, tracking=True)
    age = fields.Integer(string='Age')
    gender = fields.Selection([
        ('male', 'Male'),
        ('female', 'Female')
    ], tracking=True)
    note = fields.Text(string='Notes')
    state = fields.Selection([
        ('draft', 'Draft'),
        ('admitted', 'Admitted'),
    ], default='draft', tracking=True)

    def action_admit(self):
        logger.info("------MY LOG-------: Clicked!")

    @api.model
    def get_dashboard_data(self):
        total_patients = self.search_count([])
        male_patients = self.search_count([('gender', '=', 'male')])
        female_patients = self.search_count([('gender', '=', 'female')])

        return {
            'total_patients': total_patients,
            'male_patients': male_patients,
            'female_patients': female_patients
        }