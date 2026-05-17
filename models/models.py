from odoo import models, fields, api, _
from odoo.exceptions import ValidationError
import logging

logger = logging.getLogger('__name__')


class HospitalPatient(models.Model):
    _name = 'hospital.patient'
    _description = 'hospital.patient'
    _inherit = ['mail.thread', 'mail.activity.mixin']
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
        for rec in self:
            if not rec.age or rec.age < 0:
                raise ValidationError(_('Age must be greater than zero to admit a patient'))
            rec.state = 'admitted'

            rec.message_post(
                body=_('Patient %s has been successfully admitted to the hospital.', rec.name)
            )

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

class HospitalDoctor(models.Model):
    _name = 'hospital.doctor'
    _description = 'hospital.doctor'
