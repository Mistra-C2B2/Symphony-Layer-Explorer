import streamlit as st
import plotly.graph_objects as go
import pandas as pd
from streamlit_plotly_events import plotly_events
from openpyxl import load_workbook

#############
# Load Data #
#############

catalogue_link = "https://github.com/Mistra-C2B2/Symphony-Layers-Interactive-Explorer/blob/main/Catalogue_V22.xlsm"

# File paths

df_SYMPHONY_LAYERS = "df_SYMPHONY_LAYERS.xlsx"
df_recommendation_related_parameters = "df_recommendation_related_parameters.xlsx"
df_filtred_catalogue = "df_filtred_catalogue.xlsx"
df_REFERENCE_PARAMETERS = "df_REFERENCE_PARAMETERS.xlsx"

SYMPHONY_LAYERS_path = f"{df_SYMPHONY_LAYERS}"
recommendation_related_parameters_path = f"{df_recommendation_related_parameters}"
filtred_catalogue_path = f"{df_filtred_catalogue}"
df_REFERENCE_PARAMETERS_path = f"{df_REFERENCE_PARAMETERS}"

# Load data
df_SYMPHONY_LAYERS = pd.read_excel(SYMPHONY_LAYERS_path)
df_recommendation_related_parameters = pd.read_excel(recommendation_related_parameters_path)
df_catalogue = pd.read_excel(filtred_catalogue_path)
df_REFERENCE_PARAMETERS = pd.read_excel(df_REFERENCE_PARAMETERS_path)

# Filter and sort data
def filtering_SYMPHONY_LAYERS(category):
    df_filtered = df_SYMPHONY_LAYERS[df_SYMPHONY_LAYERS["Symphony_category"] == category].sort_values(by=["Symphony_theme", "Title"])
    return df_filtered

########
# DATA #
########

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
    df_REFERENCE_PARAMETERS["Detailled_parameters_Full_name"],
    df_REFERENCE_PARAMETERS["ID_Parameters"]
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

def df_parameter_creation(clicked_label):
    row = df_filtered[df_filtered["Title"] == clicked_label].iloc[0]
    df_parameters = df_recommendation_related_parameters[
        df_recommendation_related_parameters["Title"] == clicked_label
        ][[
            'Detailled_parameters_Full_name',
            'Parameter availability index (%)',
            'Horizontal resolution (%)',
            'Spatial coverage (%)',
            'Time coverage (%)',
            'Up-To-Date (%)'
        ]]
    return(df_parameters, row)

# Text functions #

def symphony_layer_text(row, symphony_tool_text) :
    """ Display the symphony text (summary + recommendation for data improvement) of the raster
        row : the row of the df_SYMPHONY_LAYERS dataframe corresponding to the raster
        symphony_tool_text : True/False if you need to display the grey text (only on the Ecosystems and Pressures rasters)"""
    
    st.markdown("""
        ### 2. Identify Opportunities for Data Improvement 
            """)

    st.markdown(
        f"""
        ##### {row['Title']}
        {row['Valuability smiley']} {row['Valuability']} {row['Data availability smiley']} Data availability index (%) : {row['Data availability index']}
        """,
        unsafe_allow_html=True
    )

    with st.expander("🤔 How is the **data availability index** calculated?"):
                        st.markdown(
                        """
                        The data availability index is a mean of the data parameter indexes of the related parameters list. This list is displayed in the third part **"Support Dataset Discovery"**.
                        """,
                        unsafe_allow_html=True
                        )
    
    st.markdown(f"""
        **Summary**:

        <p style='text-align: justify;'>
                {row['Summary']}
        </p>
        """,
        unsafe_allow_html=True
    )


    if symphony_tool_text == True:
        st.markdown(
            f"""
            <p style='text-align: justify; color: grey;'> These data were created as a data input layer for 'Symphony' tool developed by the marine planning unit at the Swedish Agency for Marine and Water Management (SwAM). Symphony is used by SwAM to assess the cumulative environmental impact of human activity in Swedish waters and this informs the formulation of policy at plan area scales. Re-use of these data for other purposes is only advisable with the guidance and advice of the data sources.</p>
            """,
            unsafe_allow_html=True
        )

    st.markdown(
        f"""
        **Recommendation for data improvement** :
        <p style='text-align: justify;'>{row['Recommendation']}</p>
        """,
        unsafe_allow_html=True
    )

def display_related_parameters(df_parameters, row):

    st.markdown(
        f"""
        **Explore the related parameters list**
        <p style='text-align: justify;'>The following table lists the parameters possibly related to {row['Title']}. If you are looking to a specific parameter, you can explore your own parameters.
        Each parameter is associeted with a parameter availability index.
        </p>
        """,
        unsafe_allow_html=True
    )

    with st.expander("🤔 How is the **parameter availability index** calculated?"):
        st.markdown(
        """
        The parameter availability index is a mean of 4 other indexes: the Horizontal resolution index, the Spatial coverage index, the Time coverage index, and the Up-To-Date index:
        <ul>
            <li><b>Horizontal resolution index:</b> This index represents the best horizontal resolution available for a specific parameter, based on comparisons of all related datasets. The best resolution across the datasets is used to determine the index value. A 100% index corresponds to the highest resolution (1x1 meter), while a 0% index indicates that the resolution is not specified for the datasets related to this parameter (common in series datasets). This index reflects the highest resolution across multiple datasets, even if not all datasets provide the same resolution. </li>
            <li><b>Spatial coverage index:</b> The spatial coverage index measures how much of the Swedish marine areas a parameter covers, based on available datasets. The Swedish marine areas are divided into 11 basins (Skagerrak, Kattegat, The Sound, Arkona Basin, Bornholm Basin, Western Gotland Basin, Northern Gotland Basin, Åland Sea, Sea of Bothnia, Bay of Bothnia, and The Quark). After evaluating all datasets for the parameter, the index is calculated by dividing the number of basins covered by the parameter by the total number of basins (11). The best coverage across all datasets is used, so a 100% index means the parameter is covered in all basins, possibly across several datasets. </li>
            <li><b>Time coverage index:</b> This index measures how much of a parameter's time span is covered across all related datasets. If the datasets span at least 10 years, the index is 100%. For datasets with less than 10 years of coverage, the index is calculated by dividing the number of years covered by 10. The best time span across all datasets for that parameter is used to determine the index.</li>
            <li><b>Up-To-Date index:</b> The Up-To-Date index measures how current the available datasets are for a parameter. If there is an ongoing dataset, the Up-To-Date index is 100%. If the most recent dataset is from 2015, the index is 0%. For datasets where the most recent data is between 2015 and 2025, the index is calculated by subtracting 2015 from the most recent year and dividing by 10 (e.g., for data from 2020, the index would be (2020 - 2015) / 10 = 50%). The best recent year across all related datasets is used for this calculation.</li>
        </ul>
        """,
        unsafe_allow_html=True
        )
    st.dataframe(df_parameters.reset_index(drop=True))


    selected_parameter = st.selectbox("Select a parameter of the related list to explore:", df_parameters['Detailled_parameters_Full_name'])

    if selected_parameter:
    # Filter the selected parameter's related data
        parameter_details = df_recommendation_related_parameters[df_recommendation_related_parameters['Detailled_parameters_Full_name'] == selected_parameter]
        
        # Display the second dataframe below the first
        st.markdown(f"**Datasets available related to {selected_parameter} :**")
        # Get available columns for selection
        available_columns = [
            "ID_Dataset", "Source", "Name", "Start_year", "End_year",
            "Spatial_representation", "Horizontal_resolution", "Vertical_resolution",
            "Temporal_resolution", "Source link"
        ]
        # Multiselect widget for columns
        selected_columns = st.multiselect(
            "Select columns to display:",
            options=available_columns,
            default=available_columns  # Show all by default
        )

        # Filter the dataframe based on selected columns
        df_filtred_catalogue = df_catalogue.loc[
            df_catalogue["ID_Parameters"] == dict_id_to_fullname[selected_parameter],
            selected_columns
        ]
        st.dataframe(df_filtred_catalogue)


        st.markdown(f"🔗 Copy the link in the **Source link** column to go to the dataset webpage !")
        st.markdown(f"📚 All the datasets metadata are available by downloading this excel **[Catalogue]({catalogue_link})**.")



def display_own_parameters():

    st.markdown(
        f"""
        **Explore your own parameters**
        """,
        unsafe_allow_html=True
    )
    selected_parameters = st.multiselect(
        "Explore all the parameters (you can select multiple):",
        df_REFERENCE_PARAMETERS['Detailled_parameters_Full_name']
    )

    if selected_parameters:
        st.markdown("Selected parameters :")
        # You can also filter and display details for the selected parameters
        selected_df = df_REFERENCE_PARAMETERS[
            df_REFERENCE_PARAMETERS['Detailled_parameters_Full_name'].isin(selected_parameters)
        ][[
            'Detailled_parameters_Full_name',
            'Parameter availability index (%)',
            'Horizontal resolution (%)',
            'Spatial coverage (%)',
            'Time coverage (%)',
            'Up-To-Date (%)'
        ]]
        st.dataframe(selected_df)

        with st.expander("🤔 How is the parameter availability index calculated?"):
            st.markdown(
            """
            The data availability index is a mean of 4 other indexes: the Horizontal resolution index, the Spatial coverage index, the Time coverage index, and the Up-To-Date index:
            <ul>
                <li><b>Horizontal resolution index:</b> This index represents the best horizontal resolution available for a specific parameter, based on comparisons of all related datasets. The best resolution across the datasets is used to determine the index value. A 100% index corresponds to the highest resolution (1x1 meter), while a 0% index indicates that the resolution is not specified for the datasets related to this parameter (common in series datasets). This index reflects the highest resolution across multiple datasets, even if not all datasets provide the same resolution. </li>
                <li><b>Spatial coverage index:</b> The spatial coverage index measures how much of the Swedish marine areas a parameter covers, based on available datasets. The Swedish marine areas are divided into 11 basins (Skagerrak, Kattegat, The Sound, Arkona Basin, Bornholm Basin, Western Gotland Basin, Northern Gotland Basin, Åland Sea, Sea of Bothnia, Bay of Bothnia, and The Quark). After evaluating all datasets for the parameter, the index is calculated by dividing the number of basins covered by the parameter by the total number of basins (11). The best coverage across all datasets is used, so a 100% index means the parameter is covered in all basins, possibly across several datasets. </li>
                <li><b>Time coverage index:</b> This index measures how much of a parameter's time span is covered across all related datasets. If the datasets span at least 10 years, the index is 100%. For datasets with less than 10 years of coverage, the index is calculated by dividing the number of years covered by 10. The best time span across all datasets for that parameter is used to determine the index.</li>
                <li><b>Up-To-Date index:</b> The Up-To-Date index measures how current the available datasets are for a parameter. If there is an ongoing dataset, the Up-To-Date index is 100%. If the most recent dataset is from 2015, the index is 0%. For datasets where the most recent data is between 2015 and 2025, the index is calculated by subtracting 2015 from the most recent year and dividing by 10 (e.g., for data from 2020, the index would be (2020 - 2015) / 10 = 50%). The best recent year across all related datasets is used for this calculation.</li>
            </ul>
            """,
            unsafe_allow_html=True
            )

        # Display the second dataframe below the first
        st.markdown("**Datasets available related to the selected parameters :**")
        # Get available columns for selection
        available_columns = [
            "ID_Dataset", "Source", "Name", "Start_year", "End_year",
            "Spatial_representation", "Horizontal_resolution", "Vertical_resolution",
            "Temporal_resolution", "Source link"
        ]
        # Multiselect widget for columns
        selected_columns = st.multiselect(
            "Select columns to display:",
            options=available_columns,
            default=available_columns  # Show all by default
        )

        # Get the list of parameter IDs for the selected parameters
        selected_ids = [
            dict_id_to_fullname[param]
            for param in selected_parameters
            if param in dict_id_to_fullname
        ]

        # Filter the dataframe based on selected parameter IDs and selected columns
        df_filtred_catalogue = df_catalogue.loc[
            df_catalogue["ID_Parameters"].isin(selected_ids),
            selected_columns
        ]
        st.dataframe(df_filtred_catalogue)

        st.markdown(f"🔗 Copy the link in the **Source link** column to go to the dataset webpage !")
        st.markdown(f"📚 All the datasets metadata are available by downloading this excel **[Catalogue]({catalogue_link})**.")

    # Plot the text under the pie

def display_support_dataset_discovery(df_parameters, row):
    st.markdown("""
    ### 3. Support Dataset Discovery 
    You can discover datasets in two ways:
                
    - **Explore the related parameters list:** View a curated list of parameters specifically recommended to improve the selected Symphony layer, based on recommendations for data improvement.
    - **Explore your own parameters:** Explore the complete list of reference parameters to find datasets that may better fit your specific needs or interests.

    These options help you quickly access recommended data or explore the full range of available parameters for more tailored dataset discovery.
                
    """)


    col1, col2 = st.columns(2)
    with col1:
        explore_related = st.button("Explore the related parameters list")
    with col2:
        explore_own = st.button("Explore your own parameters")

    # Only show content after a button is clicked
    if explore_related:
        st.session_state['view_mode'] = "related"
    elif explore_own:
        st.session_state['view_mode'] = "own"

    if 'view_mode' not in st.session_state:
        st.info("Please select an option above to continue.")
    elif st.session_state['view_mode'] == "related":
        display_related_parameters(df_parameters, row)

    elif st.session_state['view_mode'] == "own":
        display_own_parameters()

def wheel_plot(selected_outer):
    if selected_outer:
        point_number = selected_outer[0].get("pointNumber")
        curve_number = selected_outer[0].get("curveNumber")
        if point_number is not None and curve_number == 0:
            clicked_label = outer_labels[point_number]

            df_parameters, row = df_parameter_creation(clicked_label)   
            grey_text = True         

            symphony_layer_text(row, grey_text)

            
            display_support_dataset_discovery(df_parameters, row)

        else:
            st.warning(f" Click on the Symphony layers to explore and discover their details!")

########
# Plot #
########


st.title("Symphony Layers Interactive Explorer 🔍")

st.markdown("""
Welcome to the **Symphony Layers Interactive Explorer**.

This web application is designed to support the understanding of the **Symphony tool**, developed by the [Swedish Marine and Water Authority](https://github.com/Mistra-C2B2/MSP-Symphony). Symphony is used to assess human pressures and their impacts on marine ecosystems, supporting data-driven marine spatial planning.

For further details, refer to the official project repository:  
👉 [Symphony GitHub Repository](https://github.com/Mistra-C2B2/MSP-Symphony)

---
""")


st.markdown("""
### Purpose of this Application

The **Symphony Layers Interactive Explorer** is designed to provide a transparent overview of the data layers used within the **Symphony tool**, supporting marine spatial planning and environmental assessments.

This application serves the following purposes:
            



1. **Explore Symphony Layers**  
   The tool displays all layers used in Symphony, organized into three categories:  
   - *Ecosystem Components*  
   - *Pressures*  
   - *Source Data*

   The **Ecosystem Components** and **Pressures** categories are displayed as **Symphony Wheels**, allowing users to select a raster by clicking on the wheel. The **Source Data** category includes fundamental geospatial and environmental datasets, where users can select a raster directly.

2. **Identify Opportunities for Data Improvement**  
   Each raster layer used by Symphony is accompanied by a summary and recommendations for data improvement, based on the [Symphony Metadata Report (March 2019)](https://github.com/Mistra-C2B2/Symphony-Layers-Interactive-Explorer/blob/main/Symphony%20Metadata%20March%202019.pdf).  
   These recommendations highlight potential weaknesses in existing datasets and suggest concrete ways to enhance data quality or coverage.

3. **Support Dataset Discovery**  
   The tool provides access to a catalogue of relevant datasets that can be used to improve Symphony layers.  
   Each dataset and raster layer is described using a set of **reference parameters**, which serve to connect datasets to specific layers.

   To assist users in evaluating data quality and availability, two indicators are provided:

   - **Parameter Availability Index**: Each parameter is assigned an availability index reflecting the current quality and accessibility of datasets related to that parameter.  
   
   - **Data Availability Index**: For each raster layer, a related parameter list has been defined. The Data Availability Index is calculated as the mean of the Parameter Availability Index values for all parameters in this list. It provides a general indication of how well data is available to support the specific raster layer.

⚠️ The related parameter lists are based on recommendations and the current understanding of each raster. These lists are not exhaustive or definitive. Users are encouraged to explore the full list of reference parameters to identify additional or alternative datasets that may better suit their specific needs.

The complete reference parameter catalogue, along with the availability indexes, is available here:  
👉 [REFERENCE_PARAMETERS File](https://github.com/Mistra-C2B2/Symphony-Layers-Interactive-Explorer/blob/main/df_REFERENCE_PARAMETERS.md)

---

This tool is intended to assist stakeholders, researchers, and decision-makers by clarifying existing data limitations within Symphony, guiding improvement efforts, and facilitating access to alternative or complementary data sources.

""")

st.markdown("""
### 1. Explore Symphony Layers 
            """)


selected_category = st.selectbox("Select a category to explore:", df_SYMPHONY_LAYERS['Symphony_category'].unique())

if selected_category == 'Ecosystem' :
    df_filtered = filtering_SYMPHONY_LAYERS(selected_category)
    inner_labels, inner_values, inner_colors, outer_labels, outer_values, outer_colors = define_pie_chart_values(df_filtered)
    ecosystem = create_pie_chart(inner_labels, inner_values, inner_colors, outer_labels, outer_values, outer_colors, ecosystem_rotation)
    st.info("Click on a layer in the wheel below to explore its details.")
    selected_outer = plotly_events(ecosystem, click_event=True, select_event=False, override_height=900, override_width=900)
    wheel_plot(selected_outer)

elif selected_category == 'Pressure' :
    df_filtered = filtering_SYMPHONY_LAYERS(selected_category)
    inner_labels, inner_values, inner_colors, outer_labels, outer_values, outer_colors = define_pie_chart_values(df_filtered)
    pressure = create_pie_chart(inner_labels, inner_values, inner_colors, outer_labels, outer_values, outer_colors, pressure_rotation)
    st.info("Click on a layer in the wheel below to explore its details.")
    selected_outer = plotly_events(pressure, click_event=True, select_event=False, override_height=900, override_width=900)
    wheel_plot(selected_outer)

elif selected_category == 'Source Data' :
    df_filtered = filtering_SYMPHONY_LAYERS(selected_category)    
    selected_parameter = st.selectbox("Select a raster of the Source Data category:", df_SYMPHONY_LAYERS[df_SYMPHONY_LAYERS["Symphony_category"] == selected_category]['Title'])
    df_parameters, row = df_parameter_creation(selected_parameter)    
    grey_text = False        
    symphony_layer_text(row, grey_text)
    display_support_dataset_discovery(df_parameters, row)

