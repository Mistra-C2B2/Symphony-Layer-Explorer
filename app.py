import streamlit as st
import plotly.graph_objects as go
import pandas as pd
from streamlit_plotly_events import plotly_events

#############
# Load Data #
#############

# File paths
doc_path = r"C:\Users\PC\Documents\Ecole\2A\Stage_2A\RISE\Gap_Analysis"
df_SYMPHONY_LAYERS = "df_SYMPHONY_LAYERS.xlsx"
df_recommendation_related_parameters = "df_recommendation_related_parameters.xlsx"
df_filtred_catalogue = "df_filtred_catalogue.xlsx"
SYMPHONY_LAYERS_path = f"{doc_path}/{df_SYMPHONY_LAYERS}"
recommendation_related_parameters_path = f"{doc_path}/{df_recommendation_related_parameters}"
filtred_catalogue_path = f"{doc_path}/{df_filtred_catalogue}"

# Load data
df_SYMPHONY_LAYERS = pd.read_excel(SYMPHONY_LAYERS_path)
df_recommendation_related_parameters = pd.read_excel(recommendation_related_parameters_path)
df_catalogue = pd.read_excel(filtred_catalogue_path)

valuability_smiley = []
data_availability_smiley = []
for _, row in df_SYMPHONY_LAYERS.iterrows():
    if row["Data availability index"] >= 67:
        data_availability_smiley += [':books:']
    elif row["Data availability index"] <= 30:
        data_availability_smiley += [':notebook:']
    else :
        data_availability_smiley += [':page_facing_up:']

    if row["Valuability"] == 'Highly Valuable':
        valuability_smiley += [':bangbang:']
    elif row["Valuability"] == 'Moderately Valuable':
        valuability_smiley += [':exclamation:']
    else :
        valuability_smiley += [':grey_exclamation:']
df_SYMPHONY_LAYERS["Valuability smiley"] = valuability_smiley
df_SYMPHONY_LAYERS["Data availability smiley"] = data_availability_smiley


# Filter and sort data
category = "Ecosystem"
def filtering_SYMPHONY_LAYERS(category):
    df_filtered = df_SYMPHONY_LAYERS[df_SYMPHONY_LAYERS["Symphony_category"] == category].sort_values(by=["Symphony_theme", "Title"])
    return df_filtered

########
# DATA #
########

# Color map for inner pie chart categories
color_map = {
    'Birds': "#5b9bd5",
    'Fish': "#ed7d31",
    'Fish function': '#a5a5a5',
    'Habitat': '#ffc000',
    'Marine Mammals': '#4472c4',
    'Plants': '#70ad47',
    'Aquaculture' : '#5b9bd5',
    'Climate Change': '#ed7d31',
    'Coastal Development': '#a5a5a5',
    'Defence': '#ffc000',
    'Energy': '#4472c4',
    'Eutrophication': '#70ad47',
    'Fishing': '#255e91',
    'General Pollution': '#9e480e',
    'Industry': '#636363',
    'Mineral Mining': '#997300',
    'Recreation': '#264478',
    'Shipping': '#43682b'
}

# Create a dictionary to map parameter IDs to their full names
dict_id_to_fullname = dict(zip(
    df_recommendation_related_parameters["Detailled_parameters_Full_name"],
    df_recommendation_related_parameters["ID_Parameters"]
))

ecosystem_rotation = -20.5
pressure_rotation = -17.5

#############
# Functions #
#############

def get_inner_labels_and_values(df):
    labels = df["Symphony_theme"].unique()
    values = [df["Symphony_theme"].tolist().count(label) for label in labels]
    return labels, values

def get_outer_labels_and_colors(df, inner_labels):
    outer_labels = []
    outer_colors = []
    for label in inner_labels:
        titles = df[df["Symphony_theme"] == label]["Title"].tolist()
        outer_labels.extend(titles)
        outer_colors.extend([color_map[label]] * len(titles))
    return outer_labels, outer_colors

#############
# Pie Chart #
#############

# Prepare data for charts
def define_pie_chart_values(df_filtered):
    inner_labels, inner_values = get_inner_labels_and_values(df_filtered)
    outer_labels, outer_colors = get_outer_labels_and_colors(df_filtered, inner_labels)
    outer_values = [1] * len(outer_labels)  # Equal weight for each outer slice
    inner_colors = [color_map[label] for label in inner_labels]
    return inner_labels, inner_values, inner_colors, outer_labels, outer_values, outer_colors

# Plotly donut chart
def create_pie_chart(inner_labels, inner_values, inner_colors, outer_labels, outer_values, outer_colors, angle_rotation):
    fig = go.Figure()

    # Outer pie
    # To display two lines in pie labels, insert a line break '\n' in the label text.
    # For example, split long labels into two lines.
    formatted_outer_labels = [
        label if len(label) <= 20 else label[:label.rfind(' ', 0, 20)].replace(' ', '<br>', 1) + label[label.rfind(' ', 0, 20):] if ' ' in label[:20] else label[:20] + '<br>' + label[20:]
        for label in outer_labels
    ]
    fig.add_trace(go.Pie(
        labels=formatted_outer_labels,
        values=outer_values,
        textinfo='label',
        textfont=dict(color='white', size=9), 
        marker=dict(
            colors=outer_colors,
            line=dict(
                color='white', 
                width=1
            )),
        insidetextorientation='radial',
        hole=0.6,
        showlegend=False,
        hoverinfo='none',
        domain={'x': [0, 0.8], 'y': [0, 1]}  # Full domain for outer pie (takes up the whole space)
    ))

    # Inner pie
    formatted_inner_labels = [
        label if len(label) <= 20 else label[:label.rfind(' ', 0, 20)].replace(' ', '<br>', 1) + label[label.rfind(' ', 0, 20):] if ' ' in label[:20] else label[:20] + '<br>' + label[20:]
        for label in inner_labels
    ]
    fig.add_trace(go.Pie(
        labels=formatted_inner_labels,
        values=inner_values,
        textinfo='label',
            textfont=dict(color='white', size=9),  
        marker=dict(
            colors=inner_colors,
            line=dict(
                color='white',  
                width=1
            )),
        insidetextorientation='radial',
        hole=0.4,
        showlegend=False,
        domain={'x': [0.15, 0.65], 'y': [0.25, 0.75]},  # Adjust the range to center the inner pie
        sort=False,
        rotation=angle_rotation,
        hoverinfo='none'
    ))
    return fig

########
# Plot #
########


st.title('Symphony Layers Interactive Explorer')
st.write('Welcome to the Symphony Layer Interactive Explorer! Simply **click on the layers of the Symphony wheel** below to learn more.')

selected_category = st.selectbox("Select a category to explore:", df_SYMPHONY_LAYERS['Symphony_category'].unique())

if selected_category == 'Ecosystem' :
    df_filtered = filtering_SYMPHONY_LAYERS(selected_category)
    inner_labels, inner_values, inner_colors, outer_labels, outer_values, outer_colors = define_pie_chart_values(df_filtered)
    ecosystem = create_pie_chart(inner_labels, inner_values, inner_colors, outer_labels, outer_values, outer_colors, ecosystem_rotation)
    selected_outer = plotly_events(ecosystem, click_event=True, select_event=False, override_height=900, override_width=900)

elif selected_category == 'Pressure' :
     df_filtered = filtering_SYMPHONY_LAYERS(selected_category)
     inner_labels, inner_values, inner_colors, outer_labels, outer_values, outer_colors = define_pie_chart_values(df_filtered)
     pressure = create_pie_chart(inner_labels, inner_values, inner_colors, outer_labels, outer_values, outer_colors, pressure_rotation)
     selected_outer = plotly_events(pressure, click_event=True, select_event=False, override_height=900, override_width=900)


if selected_outer:
    point_number = selected_outer[0].get("pointNumber")
    curve_number = selected_outer[0].get("curveNumber")
    if point_number is not None and curve_number == 0:
        clicked_label = outer_labels[point_number]
        row = df_filtered[df_filtered["Title"] == clicked_label].iloc[0]
        df_parameters = df_recommendation_related_parameters[
            df_recommendation_related_parameters["Title"] == clicked_label
            ][[
                'Detailled_parameters_Full_name',
                'Parameter availability index (%)',
                'Horizontal resolution (%)',
                'Spatial coverage (%)',
                'Time coverage (%)',
                'Recent (%)'
            ]]
        st.markdown(
            f"""
            ### {row['Title']}
            {row['Valuability smiley']} {row['Valuability']} {row['Data availability smiley']} **Data availability index (%) :** {row['Data availability index']}
            #### Summary:
            <p style='text-align: justify;'>{row['Summary']}</p>

            #### Recommendation for data improvement :
            <p style='text-align: justify;'>{row['Recommendation']}</p>

            #### Related parameter list :

            """,
            unsafe_allow_html=True
        )
        st.dataframe(df_parameters.reset_index(drop=True))

        # Add interactivity for the user to click on a parameter row
        selected_parameter = st.selectbox("Select a Parameter to explore:", df_parameters['Detailled_parameters_Full_name'])
        
        if selected_parameter:
            # Filter the selected parameter's related data
            parameter_details = df_recommendation_related_parameters[df_recommendation_related_parameters['Detailled_parameters_Full_name'] == selected_parameter]
            
            # Display the second dataframe below the first
            st.markdown(f"#### Datasets available related to {selected_parameter} :")
            df_filtred_catalogue = df_catalogue.loc[
                df_catalogue["ID_Parameters"] == dict_id_to_fullname[selected_parameter],
                ["ID_Dataset", "Source", "Name", "Start_year", "End_year", "Spatial_representation", "Horizontal_resolution", "Vertical_resolution", "Temporal_resolution"]
            ]
            st.dataframe(df_filtred_catalogue)
    else:
        st.warning(f"Click on the Symphony layers to explore and discover their details!")