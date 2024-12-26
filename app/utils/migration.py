import json
from datetime import datetime


def convert_json_to_db_format(json_file_path):
    with open(json_file_path, 'r') as file:
        data = json.load(file)

    formatted_data = {'categories': [], 'subcategories': [], 'transactions': []}
    category_id = 1
    subcategory_id = 1

    for year, months in data.items():
        year_num = int(year)
        for month, categories in months.items():
            month_num = datetime.strptime(month, '%B').month
            month_date = datetime(year_num, month_num, 1)

            for category_name, subcategories in categories.items():
                month_budget = sum(float(details['Allotted']) for details in subcategories.values())

                category = {
                    'id': category_id,
                    'name': category_name,
                    'budget': month_budget,
                    'year': year_num,
                    'month': month_num,
                    'created_at': month_date  # Direct datetime object
                }
                formatted_data['categories'].append(category)

                for subcategory_name, details in subcategories.items():
                    subcategory = {
                        'id': subcategory_id,
                        'name': subcategory_name,
                        'allotted': float(details['Allotted']),
                        'category_id': category_id,
                        'created_at': month_date  # Direct datetime object
                    }
                    formatted_data['subcategories'].append(subcategory)

                    if float(details['Spending']) > 0:
                        formatted_data['transactions'].append({
                            'description': details['Comment'] or f"{subcategory_name}",
                            'amount': float(details['Spending']),
                            'date': month_date,  # Direct datetime object
                            'subcategory_id': subcategory_id
                        })
                    subcategory_id += 1
                category_id += 1

    # Debug print final data
    print("\nConverted data summary:")
    print(f"Categories: {len(formatted_data['categories'])}")
    print(f"Subcategories: {len(formatted_data['subcategories'])}")
    print(f"Transactions: {len(formatted_data['transactions'])}")

    return formatted_data
