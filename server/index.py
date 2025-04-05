# Updated loan data as per the user's latest input
loans = {
    "Olyi - Abhi": (6, 1, 6897),
    "ONE CARD": (9, 8, 7534),
    "Navi": (10, 6, 4100),
    "SAVIOUR": (12, 9, 3145),
    "Slice": (12, 7, 1900),
    "Sllice-papa": (12, 7, 3500),
    "Jupyter": (12, 5, 10250),
    "Cred_pree": (18, 9, 4989),
    "MoneyView": (24, 1, 6225),
    "AXIS": (48, 16, 4100)
}

# Start from April 2025
monthly_emi = []
current_year = 2025
current_month = "April"

# Advance loan status to reflect that March is paid
for loan in loans:
    total, paid, emi = loans[loan]
    loans[loan] = (total, paid + 1, emi)  # Increment for April

while loans:
    total_emi = 0
    completed_loans = []
    emi_details = []
    
    for loan, (total_installments, paid, emi) in loans.items():
        if paid <= total_installments:
            total_emi += emi
            emi_details.append(f"{loan} - Paid EMI: {paid}/{total_installments} | EMI: {emi}")
            loans[loan] = (total_installments, paid + 1, emi)  # Increment paid installments
        if paid == total_installments:  # If this was the last installment
            completed_loans.append(loan)
    
    # Store the monthly EMI total along with details
    monthly_emi.append({
        "Month": f"{current_month} {current_year}",
        "Total EMI": total_emi,
        "Details": emi_details,
        "Completed Loans": completed_loans if completed_loans else "None"
    })

    # Remove completed loans
    for loan in completed_loans:
        del loans[loan]

    # Update month and year
    months_order = ["January", "February", "March", "April", "May", "June", 
                    "July", "August", "September", "October", "November", "December"]
    
    current_index = months_order.index(current_month)
    if current_index == 11:
        current_month = "January"
        current_year += 1
    else:
        current_month = months_order[current_index + 1]

# Display results
for entry in monthly_emi:
    print(f"Month: {entry['Month']}")
    print(f"Total EMI: {entry['Total EMI']}")
    print("Details:")
    for detail in entry['Details']:
        print(f"  - {detail}")
    print(f"Completed Loans: {entry['Completed Loans']}")
    print("-" * 40)
