import { Big } from '../node_modules/big.js/big.mjs';
// import { LocalDate } from '@js-joda/core';
import { LocalDate } from '../node_modules/@js-joda/core/dist/js-joda.esm.js';

const txtId = $("#txt-id");
const txtName = $("#txt-name");
const txtAddress = $("#txt-address");
const txtContact = $("#txt-contact");
const txtDOB = $("#txt-dob");
const txtSalary = $("#txt-salary");

$("#frm-employee input").addClass("animate__animated");

$("#tbl-employees tbody").empty();

$("#btn-clear").on('click', () => {
    $("#frm-employee .form-group").removeClass("invalid");
    $("#frm-employee input").removeClass("animate__shakeX");
    $("#txt-name").trigger('focus');
});

$("#frm-employee").on('submit', (eventData) => {
    eventData.preventDefault();

    validateData();
});

$(".form-group input").on("input", (evenData)=>{
    $(evenData.target).parent().removeClass("invalid");
});

txtSalary.on("input", () => {
    const grossSalary = +txtSalary.val();
    let netSalary = 0;
    const nf = new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    if (grossSalary && grossSalary >= 10000 && grossSalary <= 1000000) {
        netSalary = Big(grossSalary).minus(Big(grossSalary).times(Big(5)).div(Big(100)));
    }
    $("#net-salary").text(nf.format(netSalary.toString()));
});

function validateData() {
    let valid = true;
    $(".form-group").removeClass("invalid");
    $(".form-group input").removeClass("animate__shakeX");
    const grossSalary = +txtSalary.val().trim();
    const dob = txtDOB.val().trim();
    const contact = txtContact.val().trim();
    const address = txtAddress.val().trim();
    const name = txtName.val().trim();

    if (!grossSalary) {
        setTimeout(() => txtSalary.addClass('animate__shakeX'), 0);
        txtSalary.parent().addClass('invalid');
        txtSalary.parent().children(".hint").text("Employee's salary can't be empty")
        txtSalary.trigger('select');
        valid = false;
    } else if (!(grossSalary >= 10000 && grossSalary <= 1000000)) {
        setTimeout(() => txtSalary.addClass('animate__shakeX'), 0);
        txtSalary.parent().addClass('invalid');
        txtSalary.parent().children(".hint").text("Employee's salary should be within the range of 10,000 and 1,000,000")
        txtSalary.trigger('select');
        valid = false;
    }

    if (!dob){
        setTimeout(() => txtDOB.addClass('animate__shakeX'), 0);
        txtDOB.parent().addClass('invalid');
        txtDOB.parent().children(".hint").text("Employee DOB can't be empty")
        txtDOB.trigger('select');
        valid = false;
    }else{
        const employeeDOB = LocalDate.parse(dob);
        const fourtyYearsOld = LocalDate.now().minusYears(40);
        const twentyYearsOld = LocalDate.now().minusYears(20);
        if (!(employeeDOB.isAfter(fourtyYearsOld) && employeeDOB.isBefore(twentyYearsOld))){
            setTimeout(() => txtDOB.addClass('animate__shakeX'), 0);
            txtDOB.parent().addClass('invalid');
            txtDOB.parent().children(".hint").text("Employee's age should be within the range of 20-40 years")
            txtDOB.trigger('select');
            valid = false;    
        }
    }

    if (!contact){
        setTimeout(() => txtContact.addClass('animate__shakeX'), 0);
        txtContact.parent().addClass('invalid');
        txtContact.parent().children(".hint").text("Employee's contact can't be empty")
        txtContact.trigger('select');
        valid = false;
    }else if (!/^\d{3}-\d{7}$/.test(contact)){
        setTimeout(() => txtContact.addClass('animate__shakeX'), 0);
        txtContact.parent().addClass('invalid');
        txtContact.parent().children(".hint").text("Employee's contact is invalid")
        txtContact.trigger('select');
        valid = false;
    }

    if (!address){
        setTimeout(() => txtAddress.addClass('animate__shakeX'), 0);
        txtAddress.parent().addClass('invalid');
        txtAddress.parent().children(".hint").text("Employee's address can't be empty")
        txtAddress.trigger('select');
        valid = false;
    }else if (!/.{3,}$/.test(address)){
        setTimeout(() => txtAddress.addClass('animate__shakeX'), 0);
        txtAddress.parent().addClass('invalid');
        txtAddress.parent().children(".hint").text("Employee's address is invalid")
        txtAddress.trigger('select');
        valid = false;
    }

    if (!name){
        setTimeout(() => txtName.addClass('animate__shakeX'), 0);
        txtName.parent().addClass('invalid');
        txtName.parent().children(".hint").text("Employee's name can't be empty")
        txtName.trigger('select');
        valid = false;
    }else if (!/^[A-Za-z ]+$/.test(name)){
        setTimeout(() => txtName.addClass('animate__shakeX'), 0);
        txtName.parent().addClass('invalid');
        txtName.parent().children(".hint").text("Employee's name is invalid")
        txtName.trigger('select');
        valid = false;
    }

    return valid;
}
