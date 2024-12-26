import json
from datetime import datetime


def convert_json_to_db_format(json_file_path):
    with open(json_file_path, 'r') as file:
        data = json.load(file)

    formatted_data = {
        'categories': [],
        'subcategories': [],
        'transactions': []
    }

    category_id = 1
    subcategory_id = 1
    category_map = {}

    # Debug print
    print("Starting data conversion...")

    for year, months in data.items():
        year_num = int(year)
        print(f"Processing year: {year_num}")

        for month, categories in months.items():
            # Convert month name to number
            month_num = datetime.strptime(month, '%B').month
            print(f"Processing month: {month} ({month_num})")

            for category_name, subcategories in categories.items():
                print(f"Processing category: {category_name}")

                # Get or create category
                if category_name not in category_map:
                    category = {
                        'id': category_id,
                        'name': category_name,
                        'budget': 0
                    }
                    category_map[category_name] = category_id
                    formatted_data['categories'].append(category)
                    category_id += 1

                current_category_id = category_map[category_name]

                # Track total budget for this category
                month_budget = sum(float(details['Allotted']) for details in subcategories.values())

                # Update category budget if this month's budget is higher
                category_index = next(i for i, c in enumerate(formatted_data['categories'])
                                      if c['id'] == current_category_id)
                formatted_data['categories'][category_index]['budget'] = max(
                    formatted_data['categories'][category_index]['budget'],
                    month_budget
                )

                # Process subcategories
                for subcategory_name, details in subcategories.items():
                    print(f"  Adding subcategory: {subcategory_name} for {month} {year}")

                    subcategory = {
                        'id': subcategory_id,
                        'name': subcategory_name,
                        'allotted': float(details['Allotted']),
                        'category_id': current_category_id,
                        'year': year_num,
                        'month': month_num  # This is important!
                    }
                    formatted_data['subcategories'].append(subcategory)

                    # Create transaction if there's spending
                    spending = float(details['Spending'])
                    if spending > 0:
                        transaction = {
                            'description': details['Comment'] or f"{subcategory_name} for {month} {year}",
                            'amount': spending,
                            'date': datetime(year_num, month_num, 1).isoformat(),
                            'subcategory_id': subcategory_id
                        }
                        formatted_data['transactions'].append(transaction)

                    subcategory_id += 1

    # Debug print final data
    print("\nConverted data summary:")
    print(f"Categories: {len(formatted_data['categories'])}")
    print(f"Subcategories: {len(formatted_data['subcategories'])}")
    print(f"Transactions: {len(formatted_data['transactions'])}")

    return formatted_data
