# Symphony metadata

**Anoxia background:** If this changes the colour of the water, then satellite data could be used to indicate this. However this could also not be a surface phenomenom?

**Artifical reefs:** You don't know the position of each individual wind turbine? In that case we could detect the coastal ones with Sentinel-2 data. If you have a indicator how large reefs around these structures are, you could model the artifical reef around that. In addition, some under-water vegetation can be detected by color shifts in Sentinel-2 data.

**Rough bottom photic:** One could investigate feasability of Sentinel-2 data here. Detection of underwater vegetation (or lack thereof) becomes harder as depths increase. 
**Hard bottom photic:** One could investigate feasability of Sentinel-2 data here. Detection of underwater vegetation (or lack thereof) becomes harder as depths increase.

**Mussel reef:** Limiations of the datasets says that salinity and temperature data is missing on the west coast. There are satellite data products (outside Digital Earth Sweden) that provide Sea Surface Temperature.

**Shoreline:** Dataset seems mostly focused on height, which is hard with satellite data. However vegetation (or lack thereof) could be provided with Sentinel-2 data on DES.

**Soft bottom photic:** One could investigate feasability of Sentinel-2 data here. Detection of underwater vegetation (or lack thereof) becomes harder as depths increase. Mud, silt and clay should give colour indication on shallow waters.

**Transport bottom photic:** One could investigate feasability of Sentinel-2 data here. Detection of underwater vegetation (or lack thereof) becomes harder as depths increase. Sand and gravel should give colour indication on shallow waters.

**Angiosperms:** The dataset is already derived from Sentinel 2A data. One could aim to improve on exsisting dataset, some suggestions for improvements by including additional data is already suggested in the metadata document.

**Nutrients fish farm:** Potentially the fish farms give rise to a change in colour in the ocean around them or trigger algae blooms? Could be interesting to see if you could find markers for fish farm pressures with satellite data. However, this would probably require more than the datasets on DES. 

**Climate change acidification:** I don't know if there are any ARD products based on satellite data that measure this, but could be worth investigating. Would be outside Digital Earth Sweden.

**Climate change temperature:** Sea Surface Temperature is available in ARD products and as one of things Sentinel-3 measures. Will check if we can provide an example Sentinel-3 SLSTR dataset.

**Habitat loss coastal exploitation** One could control if the values of the raster makes sense. Since this hasn't been updated since 2010/2013 I expect a lot has happened with the harbours, marinas and buildings in general along the coastline. This can probably be detected with Sentinel-2 data.

**Habitat loss dumping** Since you can study change over time with Satellite data, if the dumping is significant the colour of the bottom of the ocean will probably change. If you can connect that to habitat loss, then you could potentially improve this dataset. However, I think this is a harder task than most other datasets listed here.

**Habitat loss coastal Infrastructure** Similar to the habitat loss from exploitation the values of the raster could be checked. However, I think the added value is less here since I expect infrastructure like lighthouses and road bridges to evolve slower than other types of constructs.

**Nitrogen background** There are applications using Satellite data to monitor water data quality but I am not sure which datasets you need to look into. This would be outside Digital Earth Sweden.

**Phosphorus Background** See above

**Oilspill shipping** Oilspill has been tracked and modelled with Satellite data before. However, I suspect this would require the Sentinel-3 OLCI dataset, and for the oilspill to be large enough to be detected. Insufficient data on oil spills is listed as one of the cautions of the dataset. Larger oil spills could be detected and added with Satellite data.

**Symphony Photic Zone** Satellite based techniques are listed as a way to improve this dataset. I guess that if you can decide on what shade of blue the ocean takes on when the photic zone ends you could estimate the edge of the photic zone. I think this would be done with Sentinel-2 data since I would expect it to be fairly close to the coastal line.