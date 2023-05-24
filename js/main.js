import { Big } from '../node_modules/big.js/big.mjs';
import { LocalDate } from '../node_modules/@js-joda/core/dist/js-joda.esm.js';
import { Employee, employeeList } from './employee.js';

const txtId = $("#txt-id");
const txtName = $("#txt-name");
const txtAddress = $("#txt-address");
const txtContact = $("#txt-contact");
const txtDOB = $("#txt-dob");
const txtSalary = $("#txt-salary");

/* Set target elements for animate.css library */
$("#frm-employee input").addClass("animate__animated");

/* Remove mock rows, if there any at the startup  */
$("#tbl-employees tbody").empty();

$("#btn-clear").on('click', () => {
    $("#frm-employee .form-group").removeClass("invalid");
    $("#frm-employee input").removeClass("animate__shakeX");
    $("#net-salary").text(formatPrice(0));
    txtName.trigger('focus');
});

$(".form-group input").on("input", (evenData) => {
    /* Let's remove `invalid` class if it has been set, when we input again */
    $(evenData.target).parent().removeClass("invalid");
});

txtSalary.on("input", () => {
    const grossSalary = +txtSalary.val();
    let netSalary = 0;
    if (grossSalary && grossSalary >= 10000 && grossSalary <= 1000000) {

        /* netSalary = grossSalary - (grossSalary x 5 / 100) */
        netSalary = Big(grossSalary).minus(Big(grossSalary).times(Big(5)).div(Big(100)));
    }
    $("#net-salary").text(formatPrice(netSalary.toString()));
});

function formatPrice(price) {
    const nf = new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    return nf.format(price);
}

$("#frm-employee").on('submit', (eventData) => {
    /* Let's prevent by default action of the form */
    eventData.preventDefault();

    if (!validateData()) {
        return;
    }

    /* Let's create a new employee */
    const newEmployee = new Employee(txtName.val().trim(),
        txtAddress.val().trim(), txtContact.val().trim(),
        txtDOB.val().trim(), txtSalary.val().trim());
    /* Let's add the new employee to the employee list */
    employeeList.push(newEmployee);

    /* Let's retrive the last tab index */
    let lastTabIndex = $("#tbl-employees tbody tr:last-child").attr("tabindex") ?? 7;
    $("#tbl-employees tbody").append(newEmployee.generateHtml());
    $("#tbl-employees tbody tr:last-child").attr("tabindex", (+lastTabIndex + 1));

    /* Let's clear everything */
    $("#btn-clear").trigger("click");

    /* Let's hide the table footer */
    $("#tbl-employees tfoot").hide();
});

function validateData() {
    /* Let's assume all are valid at first */
    let valid = true;
    $(".form-group").removeClass("invalid");
    $(".form-group input").removeClass("animate__shakeX");

    const grossSalary = +txtSalary.val().trim();
    const dob = txtDOB.val().trim();
    const contact = txtContact.val().trim();
    const address = txtAddress.val().trim();
    const name = txtName.val().trim();

    /* Validate salary */
    if (!grossSalary) {
        valid = invalidate(txtSalary, "Employee's salary can't be empty");
    } else if (!(grossSalary >= 10000 && grossSalary <= 1000000)) {
        valid = invalidate(txtSalary, "Employee's salary should be within the range of 10,000 and 1,000,000");
    }

    /* Validate DOB */
    if (!dob) {
        valid = invalidate(txtDOB, "Employee DOB can't be empty");
    } else {
        const employeeDOB = LocalDate.parse(dob);
        const fourtyYearsOld = LocalDate.now().minusYears(40);
        const twentyYearsOld = LocalDate.now().minusYears(20);
        if (!(employeeDOB.isAfter(fourtyYearsOld) && employeeDOB.isBefore(twentyYearsOld))) {
            valid = invalidate(txtDOB, "Employee's age should be within the range of 20-40 years");
        }
    }

    /* Validate contact */
    if (!contact) {
        valid = invalidate(txtContact, "Employee's contact can't be empty");
    } else if (!/^\d{3}-\d{7}$/.test(contact)) {
        valid = invalidate(txtContact, "Employee's contact is invalid");
    }

    /* Validate address */
    if (!address) {
        setTimeout(() => txtAddress.addClass('animate__shakeX'), 0);
        valid = invalidate(txtAddress, "Employee's address can't be empty");
    } else if (!/.{3,}$/.test(address)) {
        valid = invalidate(txtAddress, "Employee's address is invalid");
    }

    /* Validate name */
    if (!name) {
        valid = invalidate(txtName, "Employee's name can't be empty");
    } else if (!/^[A-Za-z ]+$/.test(name)) {
        valid = invalidate(txtName, "Employee's name is invalid");
    }

    return valid;
}

function invalidate(txt, message) {
    setTimeout(() => txt.addClass('animate__shakeX'), 0);
    txt.parent().addClass('invalid');

    /* Let's change the hint message */
    txt.parent().children(".hint").text(message);
    txt.trigger('select');
    return false;
}

/* Let's setup some delegated event handlers */
$("#tbl-employees tbody").on('click', 'tr > td:last-child', (eventData) => {
    const row = $(eventData.target).parents("tr");
    const empId = row.children("td:first-child").text();
    employeeList.find(emp => emp.getEmployeeId() === empId).delete();
    row.remove();
    if (!employeeList.length) $("#tbl-employees tfoot").show();
});