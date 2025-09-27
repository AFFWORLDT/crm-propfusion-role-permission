import { formateBayutLocationOptions, formatLocationsOptions } from "./utils";

function normalizeLocationForPayload(locationObj) {
    if (!locationObj || typeof locationObj !== "object") return locationObj;
    const rawId = locationObj.id;
    const normalizedId =
        typeof rawId === "string" && rawId.includes(".")
            ? rawId.split(".").pop()
            : rawId ?? null;
    const stringId = normalizedId != null ? String(normalizedId) : normalizedId;
    return { ...locationObj, id: stringId };
}

export function buildPropertyData(data, listingType) {
    let extraParams;
    if (listingType === "SELL") {
        extraParams = {
            completionStatus: data.completionStatus,
            acCharge: data.acCharge,
            serviceCharge: data.serviceCharge,
            hasMortgage: data.hasMortgage,
        };
    } else if (listingType === "RENT") {
        extraParams = {
            cheques: data.cheques,
            deposit: data.deposit,
            priceType: data.priceType,
            availabilityDate: data.availabilityDate
                ? data.availabilityDate.toISOString()
                : "",
        };
    }

    return {
        dewa_no: data?.dewa_no,
        building_id: data.building_id ? data?.building_id?.value : null,
        location: data?.location
            ? normalizeLocationForPayload(data.location?.value)
            : null,
        title: data.title,
        description: data.description,
        listingType,
        property_type: data.property_type,
        price: data.price,
        agent_Id: data.agent_Id?.value,
        area_id: data.area_id?.value,
        source_of_listing: data.source_of_listing,
        developerId: data.developerId?.value?.toString(),
        size: data.size,
        plotSize: data.plotSize,
        bedRooms: data.bedRooms ? parseInt(data.bedRooms) : 0,
        bathrooms: data.bathrooms?.toString(),
        isFurnished: data.isFurnished,
        propertyFinder: data.propertyFinder ? "ENABLE" : "",
        propfusionPortal: data.propfusionPortal ? "ENABLE" : "",
        customPortal: data.customPortal ? "ENABLE" : "",
        ownPortal: data.ownPortal ? "ENABLE" : "",
        bayut: data.bayut ? "ENABLE" : "",
        dubizzle: data.dubizzle ? "ENABLE" : "",
        houseNo: data.houseNo,
        owner_id: data.owner_id?.value?.id,
        ownerParam: {
            landlordName: data.landlordName,
            email: data.email ? data.email.toLowerCase() : "",
            nationality: JSON.stringify(data.nationality),
            landlordPhone: data.landlordPhone
                ? `${data.telCodePrimary?.value || ""} ${data.landlordPhone}`.trim()
                : "",
            secondryPhone: data.secondryPhone
                ? `${data.telCodeSecondary?.value || ""} ${data.secondryPhone}`.trim()
                : "",
        },
        view360: data.view360,
        videoLink: data.videoLink,
        buildYear: data.buildYear
            ? data.buildYear.getFullYear().toString()
            : "",
        occupancy: data.occupancy,
        totalFloor: data.totalFloor,
        floor: data.floor,
        parking: data.parking,
        amenities: data.amenities?.map?.((item) => item.value) || [],
        permitNumber: data.permitNumber,
        permitUrl: data.permitUrl,
        offplanDetails_amountPaid: data.offplanDetails_amountPaid,
        offplanDetails_originalPrice: data.offplanDetails_originalPrice,
        public_status: data.public_status === "YES" ? true : false,
        propertyFinderLocation:
            data.propertyFinder && data.propertyFinderLocation?.value
                ? normalizeLocationForPayload(data.propertyFinderLocation.value)
                : null,
        bayutLocation:
            (data.bayut || data.dubizzle) && data.bayutLocation?.value
                ? data.bayutLocation.value
                : null,
        isDtcmPermit: data.isDtcmPermit,
        price_on_application: data.price_on_application ? "Yes" : "No",
        propertyFinder_agent_Id: data?.propertyFinder
            ? +data?.propertyFinder_agent_Id?.value
            : 0,
        bayut_dubizzle_agent_Id:
            data.bayut || data.dubizzle
                ? data?.bayut_dubizzle_agent_Id?.value
                : 0,
        propfusionPortal_agent_Id: data?.propfusionPortal
            ? +data?.propfusionPortal_agent_Id?.value
            : 0,
        ownPortal_agent_Id: data?.ownPortal
            ? +data?.ownPortal_agent_Id?.value
            : 0,
        isCustomReferenceNumber: data.isCustomReferenceNumber || false,
        propertyId: data.isCustomReferenceNumber ? data.propertyId : null,
        ...extraParams,
        offplanDetails_dldWaiver: data?.offplanDetails_dldWaiver,
    };
}

export function buildEditPropertyData(data, amenitiesData) {
    const defaultData = {
        ...data,
        ...data?.ownerParam,
        offplanDetails_dldWaiver: data.offplanDetails_dldWaiver,
        building_id: data?.building_id
            ? {
                  value: data.building_info?.id,
                  label: data.building_info?.building_name,
              }
            : null,
        owner_id: data.owner_info
            ? {
                  value: data?.owner_info,
                  label: data?.owner_info?.owner_name || "s",
              }
            : "",
        houseNo: data.houseNo,
        property_type: data.property_type ? data.property_type : "",
        nationality: data?.owner_info?.nationality || "",
        buildYear: data.buildYear ? new Date(data.buildYear, 0, 1) : "",
        availabilityDate: data?.availabilityDate
            ? new Date(data.availabilityDate)
            : "",
        agent_Id: data.agent_Id
            ? {
                  label: data.agent?.name,
                  value: data.agent_Id,
              }
            : null,
        area_id: data.area_id
            ? {
                  label: data.area?.name,
                  value: data.area_id,
              }
            : null,
        developerId: data.developerId
            ? {
                  label: data.developer.name,
                  value: data.developerId,
              }
            : null,
        amenities: amenitiesData
            ?.filter((obj) => data.amenities?.includes(obj.code))
            .map((obj) => {
                return {
                    label: obj.label,
                    value: obj.code,
                };
            }),
        propertyFinderLocation: data?.propertyFinderLocation
            ? formatLocationsOptions([data?.propertyFinderLocation])[0]
            : "",
        location: data?.location
            ? formatLocationsOptions([data?.location])[0]
            : "",
        bayutLocation: data?.bayutLocation
            ? formateBayutLocationOptions([data?.bayutLocation])[0]
            : "",
        propsearch_agent_Id: data?.propsearch_agent_Id
            ? {
                  value: data?.propfusionPortal_agent?.id,
                  label: data?.propfusionPortal_agent?.name,
              }
            : "",
        propertyFinder_agent_Id: data?.propertyFinder_agent_Id
            ? {
                  value: data?.propertyFinder_agent?.id,
                  label: data?.propertyFinder_agent?.name,
              }
            : "",
        bayut_dubizzle_agent_Id: data?.bayut_dubizzle_agent_Id
            ? {
                  value: data?.bayut_dubizzle_agent?.id,
                  label: data?.bayut_dubizzle_agent?.name,
              }
            : "",
        propfusionPortal_agent_Id: data?.propfusionPortal_agent_Id
            ? {
                  value: data?.propfusionPortal_agent?.id,
                  label: data?.propfusionPortal_agent?.name,
              }
            : "",
        ownPortal_agent_Id: data?.ownPortal_agent_Id
            ? {
                  value: data?.ownPortal_agent?.id,
                  label: data?.ownPortal_agent?.name,
              }
            : "",
        dewa_no: data?.dewa_no,
    };

    delete defaultData.photos;
    delete defaultData.ownerDocs;
    delete defaultData.ownerParam;

    return defaultData;
}

export function buildProjectData(data) {
    
    return {
        name: data.name,
        description: data.description,
        area_id: data.area_id?.value,
        developerId: data.developerId?.value,
        pool_type: data.pool_type?.value,
        postHandover: data.postHandover === true ? true : false,
        governmentFees: data.governmentFees,
        agent_Id: data.agent_Id?.value,
        ...(data.saleStartDate ? { saleStartDate: data.saleStartDate } : {}),
        numberOfBuilding: data.numberOfBuilding,
        propertyTypes: data.propertyTypes?.map?.((item) => item.value) || [],
        furnishing: data.furnishing,
        type_of_ownership: data.type_of_ownership,
        resale_allowed_after: data.resale_allowed_after ? String(data.resale_allowed_after) : null,
        newParam: {
            price: data.price || 0,
            propertyFee: data.propertyFee || 0,
            amenities: data.amenities?.map?.((item) => item.value) || [],
            size_min: data.size_min || 0,
            size_max: data.size_max || 0,
            bedroomMin: data.bedroomMin || 0,
            bedroomMax: data.bedroomMax || 0,
            totalUnits: data.totalUnits || 0,
            totalFloor: data.totalFloor || 0,
            ...(data.handoverTime && { handoverTime: data.handoverTime }),
            permitUrl: data.permitUrl,
            permitQRCode: data.permitQRCode,
        },
        payment_planParam: {
            first_installment: data.first_installment,
            under_construction: data.under_construction,
            on_handover: data.on_handover,
            post_handover: data.post_handover,
        },
        location: data?.location?.value,
    };
}

export function buildStaffData(data, avatar) {
    return {
        ...data,
        team: data.team.value,
        email: data.email ? data.email.toLowerCase() : "",
        phone: data.phone
            ? `${data.telCode?.value || ""} ${data.phone}`.trim()
            : "",
        dob: data.dob ? data.dob.toISOString() : "",
        nationality: JSON.stringify(data.nationality),
        avatar,
        languages: data.languages.map((item) => item.value),
        role_id:data?.role_id ? +data?.role_id :null
    };
}

export function buildBuildingData(data) {
    return {
        ...data,
        watchman_id: data.watchman_id?.value,
        building_name: data.building_name,
        building_no: data.building_no,
        total_units_counts: data.total_units_counts,
        units_type: data.units_type,
        makani_no: data.makani_no,
        plot_no: data.plot_no,
        dm_no: data.dm_no,
        main_dewa_no: data.main_dewa_no,
        owner_id: data.owner_id?.value?.id,
        no_of_leasing_years: data.no_of_leasing_years,
        contract_start_date: data.contract_start_date,
        contract_end_date: data.contract_end_date,
        building_status: data.building_status,
        payment_type: data.payment_type,
        annual_rent_method: data.annual_rent_method?.value,
        security_amount_payment_condition:
            data.security_amount_payment_condition,
        security_amount_payment_method:
            data.security_amount_payment_method?.value,
        commission_payment_method: data.commission_payment_method?.value,
        commission_amount: data.commission_amount,
        no_of_cheques: data.no_of_cheques,
        bank_name: data.bank_name,
        cheque_payments: data.cheque_payments
            ? data?.cheque_payments.map((item) => ({
                  ...item,
                  payment_status: item?.payment_status?.value,
              }))
            : [],
        photos: data.photos,
        passport_copy: data.passport_copy,
        emirates_id_copy: data.emirates_id_copy,
        management_contract: data.management_contract,
        tenancy_lease_contract: data.tenancy_lease_contract,
        title_deed: data.title_deed,
        affection_plan: data.affection_plan,
        poa_noc: data.poa_noc,
        building_drawing: data.building_drawing,
        handover_documents: data.handover_documents,
        other_documents: data.other_documents,
        comments: data.comments,
        watchman_info: {
            ...(data.watchman_info?.name && { name: data.watchman_info.name }),
            ...(data.watchman_info?.contact_no && {
                contact_no: data.watchman_info.contact_no,
            }),
            ...(data.watchman_info?.email && {
                email: data.watchman_info.email?.toLowerCase(),
            }),
        },
        created_by: data?.created_by,
        agent_id: data?.agent_id?.value,
        location: data?.location?.value,
        area_id: data?.area_id?.value,
        developer_id: data?.developer_id?.value,
        propertyTypes: data?.propertyTypes?.map?.((item) => item.value) || [],
    };
}

export function buildBuildingEditData(data) {
    return {
        ...data,
        cheque_payments: data.cheque_payments
            ? data?.cheque_payments.map((item) => ({
                  ...item,
                  payment_status: {
                      label: item?.payment_status?.toUpperCase(),
                      value: item?.payment_status,
                  },
              }))
            : [],

        agent_id: data.agent
            ? {
                  value: data.agent.id,
                  label: data.agent.name,
              }
            : null,
        developer_id: data.developer
            ? {
                  value: data.developer.id,
                  label: data.developer.name,
              }
            : null,

        location: data.location
            ? formatLocationsOptions([data.location])[0]
            : null,
        area_id: data.area
            ? {
                  value: data.area.id,
                  label: data.area.name,
              }
            : null,
        owner_id: {
            value: data.owner_id?.id,
            label: data.owner?.owner_name,
        },
        commission_payment_method: data.commission_payment_method
            ? {
                  value: data.commission_payment_method,
                  label: data.commission_payment_method,
              }
            : null,
        security_amount_payment_method: data.security_amount_payment_method
            ? {
                  value: data.security_amount_payment_method,
                  label: data.security_amount_payment_method,
              }
            : null,
        annual_rent_method: data.annual_rent_method
            ? {
                  value: data.annual_rent_method,
                  label: data.annual_rent_method,
              }
            : null,
        landlordName: data.owner?.owner_name,
        email: data.owner?.lessor_email,
        nationality: data.owner?.nationality,
        landlordPhone: data.owner?.lessor_phone,
        secondryPhone: data.owner?.secondryPhone,
        lessor_name: data.owner?.lessor_name,
        lessor_emirates_id: data.owner?.lessor_emirates_id,
        license_no: data.owner?.license_no,
        owner_type: data.owner?.owner_type,
        owner_info: data.owner?.owner_info,
        watchman_id: data.watchman
            ? {
                  value: data?.watchman.id,
                  label: data?.watchman.name,
              }
            : null,
    };
}

function cleanObject(obj) {
    if (obj === null || obj === undefined) return undefined;

    if (typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
        return obj.map(cleanObject).filter((item) => item !== undefined);
    }

    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
        const cleanedValue = cleanObject(value);
        if (
            cleanedValue !== undefined &&
            cleanedValue !== null &&
            cleanedValue !== ""
        ) {
            cleaned[key] = cleanedValue;
        }
    }

    return Object.keys(cleaned).length ? cleaned : undefined;
}

export function buildVehicleData(data) {
    const vehicleData = {
        comments: data?.comments,
        inspection_date: data.inspection_date,
        brand: data?.brand,
        model: data?.model,
        year: data?.year ? +data?.year : 0,
        specs: data?.specs,
        transmission: data?.transmission?.value,
        interior_trim: data?.interior_trim,
        engine_cylinders: data?.engine_cylinders,
        odometer_reading_km: data?.odometer_reading_km,
        paint_type: data?.paint_type?.value,
        accident_history: data?.accident_history,
        history_report: data?.history_report,
        service_history: data?.service_history,
        service_type: data?.service_type,
        body_type: data?.body_type?.value,
        drive: data?.drive?.value,
        fuel_type: data?.fuel_type?.value,
        engine_size_liters: data?.engine_size_liters
            ? +data?.engine_size_liters
            : 0,
        chassis_damage: data?.chassis_damage,
        chassis_repaired: data?.chassis_repaired,
        car_registered_in: data?.car_registered_in,
        bank_loan: data?.bank_loan,
        navigation_system: data?.navigation_system,
        keys_number: data?.keys_number ? +data?.keys_number : 0,
        roof: data?.roof ? data?.roof : "",
        rim_type: data?.rim_type,
        rim_condition: data?.rim_condition?.value,
        seats_color: data?.seats_color,
        color: data?.color,
        body_inspection: {
            front_bumper: data?.front_bumper?.value,
            rear_bumper: data?.rear_bumper?.value,
            bonnet: data?.bonnet?.value,
            trunk: data?.trunk?.value,
            roof: data?.body_inspection_roof?.value,
            front_right_fender: data?.front_right_fender?.value,
            rear_right_quarter_panel: data?.rear_right_quarter_panel?.value,
            front_right_door: data?.front_right_door?.value,
            rear_right_door: data?.rear_right_door?.value,
            front_left_fender: data?.front_left_fender?.value,
            rear_left_quarter_panel: data?.rear_left_quarter_panel?.value,
            front_left_door: data?.front_left_door?.value,
            rear_left_door: data?.rear_left_door?.value,
        },
        engine_inspection: {
            engine_start_properly: data?.engine_start_properly,
            engine_condition: data?.engine_condition?.value,
            engine_group: data?.engine_group?.value,
            engine_noise: data?.engine_noise?.value,
            suspension_noise: data?.suspension_noise?.value,
            engine_exhaust: data?.engine_exhaust?.value,
            transmission_condition: data?.transmission_condition?.value,
            engine_hoses: data?.engine_hoses?.value,
            supercharger_turbocharger: data?.supercharger_turbocharger?.value,
            water_sludge: data?.water_sludge?.value,
            automatic_transmission: data?.automatic_transmission?.value,
            transfer_case: data?.transfer_case?.value,
            differential_drive_axle: data?.differential_drive_axle?.value,
            engine_visual_inspection: data?.engine_visual_inspection?.value,
        },
        glasses_inspection: {
            rear_window: data?.rear_window?.value,
            windshield_glass: data?.windshield_glass?.value,
            sunroof_glass: data?.sunroof_glass?.value,
        },
        ac_heating_inspection: {
            air_condition: data?.air_condition?.value,
            heating_system: data?.heating_system?.value,
        },
        obd_report: {
            diagnostic_report: data?.diagnostic_report?.value,
        },
        engine_compartment_inspection: {
            tappet_noise: data?.tappet_noise?.value,
            engine_shield_cover: data?.engine_shield_cover?.value,
            coolant_level: data?.coolant_level?.value,
            engine_mounting: data?.engine_mounting?.value,
            bonnet_hinge_catch: data?.bonnet_hinge_catch?.value,
            drive_belts: data?.drive_belts?.value,
            engine_oil: data?.engine_oil?.value,
            water_pump: data?.water_pump?.value,
            fuse_box: data?.fuse_box?.value,
            belt_ac: data?.belt_ac?.value,
            ac_fan_motor: data?.ac_fan_motor?.value,
            engine_seals: data?.engine_seals?.value,
            drive_shafts_assemblies: data?.drive_shafts_assemblies?.value,
            transmission_fluid: data?.transmission_fluid?.value,
            gear_mountings: data?.gear_mountings?.value,
            silencer_catalyst: data?.silencer_catalyst?.value,
            oxygen_sensor: data?.oxygen_sensor?.value,
            radiator: data?.radiator?.value,
            pipes: data?.pipes?.value,
        },
        brakes_inspection: {
            brake_pads: data?.brake_pads?.value,
            parking_brake: data?.parking_brake?.value,
            abs_warning_signal: data?.abs_warning_signal?.value,
        },
        electrical_controls_inspection: {
            car_battery: data?.car_battery?.value,
            sunroof_operation: data?.sunroof_operation?.value,
            driver_window_operation: data?.driver_window_operation?.value,
            horn_operation: data?.horn_operation?.value,
            air_conditioner: data?.air_conditioner?.value,
            climate_control: data?.climate_control?.value,
            entertainment_system: data?.entertainment_system?.value,
            side_mirror_controls: data?.side_mirror_controls?.value,
            head_lights: data?.head_lights?.value,
            rear_lights: data?.rear_lights?.value,
            fog_lights: data?.fog_lights?.value,
            interior_lights: data?.interior_lights?.value,
            indicators_side_lights: data?.indicators_side_lights?.value,
            key_remote_battery: data?.key_remote_battery?.value,
            lcd_display: data?.lcd_display?.value,
            cameras: data?.cameras?.value,
            push_start: data?.push_start?.value,
            instrument_functions: data?.instrument_functions?.value,
            wipers_washers: data?.wipers_washers?.value,
            door_locking: data?.door_locking?.value,
            switches_controls: data?.switches_controls?.value,
            steering_wheel_switches: data?.steering_wheel_switches?.value,
            hazard_lights_button: data?.hazard_lights_button?.value,
            starting_system_ignition_lock:
                data?.starting_system_ignition_lock?.value,
            sunroof_switch_board: data?.sunroof_switch_board?.value,
            rear_power_window_switch: data?.rear_power_window_switch?.value,
            front_power_window_switch: data?.front_power_window_switch?.value,
        },
        suspension_steering_inspection: {
            steering_rack: data?.steering_rack?.value,
            rack_end: data?.rack_end?.value,
            front_differential: data?.front_differential?.value,
            right_springs_shock_absorbers:
                data?.right_springs_shock_absorbers?.value,
            right_axle: data?.right_axle?.value,
            right_ball_joint: data?.right_ball_joint?.value,
            power_steering: data?.power_steering?.value,
            power_steering_fluid: data?.power_steering_fluid?.value,
            wheel_hubs_bearings: data?.wheel_hubs_bearings?.value,
            left_springs_shock_absorbers:
                data?.left_springs_shock_absorbers?.value,
            left_axle: data?.left_axle?.value,
            left_ball_joint: data?.left_ball_joint?.value,
            left_dampers_bushes: data?.left_dampers_bushes?.value,
            right_rear_shock_absorbers: data?.right_rear_shock_absorbers?.value,
            right_rear_bushes: data?.right_rear_bushes?.value,
            left_rear_shock_absorbers: data?.left_rear_shock_absorbers?.value,
            left_rear_bushes: data?.left_rear_bushes?.value,
            steering_box: data?.steering_box?.value,
            right_dampers_bushes: data?.right_dampers_bushes?.value,
        },
        interiors_inspection: {
            spare_wheel: data?.spare_wheel,
            window_blinds: data?.window_blinds,
            dashboard_condition: data?.dashboard_condition?.value,
            speedometer_cluster: data?.speedometer_cluster?.value,
            steering_wheel: data?.steering_wheel?.value,
            center_console_box: data?.center_console_box?.value,
            visor: data?.visor?.value,
            internal_mirrors: data?.internal_mirrors?.value,
            door_fittings_operation: data?.door_fittings_operation?.value,
            door_hinges: data?.door_hinges?.value,
            interior_sills_door_shuts: data?.interior_sills_door_shuts?.value,
            trim_panels: data?.trim_panels?.value,
            carpets: data?.carpets?.value,
            arm_rest: data?.arm_rest?.value,
            seat_leather_fabric: data?.seat_leather_fabric?.value,
            seat_belts: data?.seat_belts?.value,
            front_right_seat_control: data?.front_right_seat_control?.value,
            front_left_seat_control: data?.front_left_seat_control?.value,
            boot_trunk_area: data?.boot_trunk_area?.value,
            tools_safety_kit: data?.tools_safety_kit?.value,
        },
        tyres_inspection: {
            front_left: {
                manufacturer: data?.front_left_tyre_manufacturer,
                production_date: data?.front_left_tyre_production_date,
                condition: data?.front_left_tyre_condition?.value,
            },
            front_right: {
                manufacturer: data?.front_right_tyre_manufacturer,
                production_date: data?.front_right_tyre_production_date,
                condition: data?.front_right_tyre_condition?.value,
            },
            rear_left: {
                manufacturer: data?.rear_left_tyre_manufacturer,
                production_date: data?.rear_left_tyre_production_date,
                condition: data?.rear_left_tyre_condition?.value,
            },
            rear_right: {
                manufacturer: data?.rear_right_tyre_manufacturer,
                production_date: data?.rear_right_tyre_production_date,
                condition: data?.rear_right_tyre_condition?.value,
            },
        },
        exteriors_inspection: {
            bumpers: data?.bumpers?.value,
            number_plates: data?.number_plates?.value,
            right_side_mirror: data?.right_side_mirror?.value,
            left_side_mirror: data?.left_side_mirror?.value,
            grill: data?.grill?.value,
            wheel_caps_alloys: data?.wheel_caps_alloys?.value,
            chassis: data?.chassis?.value,
            fender_shield: data?.fender_shield?.value,
        },
        road_test_inspection: {
            traction_control: data?.traction_control?.value,
            engine_noise: data?.engine_noise?.value,
            engine_performance: data?.engine_performance?.value,
            overheating_evidence: data?.overheating_evidence?.value,
            gear_shifting: data?.gear_shifting?.value,
            cruise_control: data?.cruise_control?.value,
            suspension_noise: data?.suspension_noise?.value,
            ac_operation: data?.ac_operation?.value,
            steering_alignment: data?.steering_alignment?.value,
            brake_operation: data?.brake_operation?.value,
        },
        status: "ACTIVE",
        priceType: data?.priceType,
        price: data?.price ? +data?.price : 0,
        manufacturer_id: data?.manufacturer_id?.value,
    };

    return cleanObject(vehicleData);
}

export function buildEditVehicle(data) {
    if (!data) return {};

    return {
        ...data,

        transmission: data?.transmission
            ? {
                  value: data.transmission,
                  label: data.transmission,
              }
            : null,
        paint_type: data?.paint_type
            ? {
                  value: data.paint_type,
                  label: data.paint_type,
              }
            : null,

        body_type: data?.body_type
            ? {
                  value: data.body_type,
                  label: data.body_type,
              }
            : null,
        drive: data?.drive
            ? {
                  value: data.drive,
                  label: data.drive,
              }
            : null,
        fuel_type: data?.fuel_type
            ? {
                  value: data.fuel_type,
                  label: data.fuel_type,
              }
            : null,
        rim_condition: data?.rim_condition
            ? {
                  value: data.rim_condition,
                  label: data.rim_condition,
              }
            : null,
        inspection_date: data.inspection_date
            ? new Date(data.inspection_date)
            : "",
        front_bumper: formatSelectOption(data?.body_inspection?.front_bumper),
        bonnet: formatSelectOption(data?.body_inspection?.bonnet),
        front_left_door: formatSelectOption(
            data?.body_inspection?.front_left_door
        ),
        front_left_fender: formatSelectOption(
            data?.body_inspection?.front_left_fender
        ),
        front_right_door: formatSelectOption(
            data?.body_inspection?.front_right_door
        ),
        front_right_fender: formatSelectOption(
            data?.body_inspection?.front_right_fender
        ),
        rear_bumper: formatSelectOption(data?.body_inspection?.rear_bumper),
        rear_left_door: formatSelectOption(
            data?.body_inspection?.rear_left_door
        ),
        rear_left_quarter_panel: formatSelectOption(
            data?.body_inspection?.rear_left_quarter_panel
        ),
        rear_right_door: formatSelectOption(
            data?.body_inspection?.rear_right_door
        ),
        rear_right_quarter_panel: formatSelectOption(
            data?.body_inspection?.rear_right_quarter_panel
        ),
        trunk: formatSelectOption(data?.body_inspection?.trunk),

        engine_start_properly: data?.engine_inspection?.engine_start_properly,
        engine_condition: formatSelectOption(
            data?.engine_inspection?.engine_condition
        ),
        engine_group: formatSelectOption(data?.engine_inspection?.engine_group),
        engine_noise: formatSelectOption(data?.engine_inspection?.engine_noise),
        suspension_noise: formatSelectOption(
            data?.engine_inspection?.suspension_noise
        ),
        engine_exhaust: formatSelectOption(
            data?.engine_inspection?.engine_exhaust
        ),
        transmission_condition: formatSelectOption(
            data?.engine_inspection?.transmission_condition
        ),
        engine_hoses: formatSelectOption(data?.engine_inspection?.engine_hoses),
        supercharger_turbocharger: formatSelectOption(
            data?.engine_inspection?.supercharger_turbocharger
        ),
        water_sludge: formatSelectOption(data?.engine_inspection?.water_sludge),
        automatic_transmission: formatSelectOption(
            data?.engine_inspection?.automatic_transmission
        ),
        transfer_case: formatSelectOption(
            data?.engine_inspection?.transfer_case
        ),
        differential_drive_axle: formatSelectOption(
            data?.engine_inspection?.differential_drive_axle
        ),
        engine_visual_inspection: formatSelectOption(
            data?.engine_inspection?.engine_visual_inspection
        ),
        rear_window: formatSelectOption(data?.glasses_inspection?.rear_window),
        windshield_glass: formatSelectOption(
            data?.glasses_inspection?.windshield_glass
        ),
        sunroof_glass: formatSelectOption(
            data?.glasses_inspection?.sunroof_glass
        ),

        air_condition: formatSelectOption(
            data?.ac_heating_inspection?.air_condition
        ),
        heating_system: formatSelectOption(
            data?.ac_heating_inspection?.heating_system
        ),
        diagnostic_report: formatSelectOption(
            data?.obd_report?.diagnostic_report
        ),

        tappet_noise: formatSelectOption(
            data?.engine_compartment_inspection?.tappet_noise
        ),
        engine_mounting: formatSelectOption(
            data?.engine_compartment_inspection?.engine_mounting
        ),
        engine_seals: formatSelectOption(
            data?.engine_compartment_inspection?.engine_seals
        ),
        engine_oil: formatSelectOption(
            data?.engine_compartment_inspection?.engine_oil
        ),
        coolant_level: formatSelectOption(
            data?.engine_compartment_inspection?.coolant_level
        ),
        water_pump: formatSelectOption(
            data?.engine_compartment_inspection?.water_pump
        ),
        radiator: formatSelectOption(
            data?.engine_compartment_inspection?.radiator
        ),
        pipes: formatSelectOption(data?.engine_compartment_inspection?.pipes),
        drive_belts: formatSelectOption(
            data?.engine_compartment_inspection?.drive_belts
        ),
        belt_ac: formatSelectOption(
            data?.engine_compartment_inspection?.belt_ac
        ),
        drive_shafts_assemblies: formatSelectOption(
            data?.engine_compartment_inspection?.drive_shafts_assemblies
        ),
        gear_mountings: formatSelectOption(
            data?.engine_compartment_inspection?.gear_mountings
        ),
        fuse_box: formatSelectOption(
            data?.engine_compartment_inspection?.fuse_box
        ),
        ac_fan_motor: formatSelectOption(
            data?.engine_compartment_inspection?.ac_fan_motor
        ),
        oxygen_sensor: formatSelectOption(
            data?.engine_compartment_inspection?.oxygen_sensor
        ),
        engine_shield_cover: formatSelectOption(
            data?.engine_compartment_inspection?.engine_shield_cover
        ),
        bonnet_hinge_catch: formatSelectOption(
            data?.engine_compartment_inspection?.bonnet_hinge_catch
        ),
        silencer_catalyst: formatSelectOption(
            data?.engine_compartment_inspection?.silencer_catalyst
        ),

        // Adding brake inspection fields
        brake_pads: formatSelectOption(data?.brakes_inspection?.brake_pads),
        parking_brake: formatSelectOption(
            data?.brakes_inspection?.parking_brake
        ),
        abs_warning_signal: formatSelectOption(
            data?.brakes_inspection?.abs_warning_signal
        ),

        // Adding electrical controls inspection fields
        car_battery: formatSelectOption(
            data?.electrical_controls_inspection?.car_battery
        ),
        sunroof_operation: formatSelectOption(
            data?.electrical_controls_inspection?.sunroof_operation
        ),
        driver_window_operation: formatSelectOption(
            data?.electrical_controls_inspection?.driver_window_operation
        ),
        horn_operation: formatSelectOption(
            data?.electrical_controls_inspection?.horn_operation
        ),
        air_conditioner: formatSelectOption(
            data?.electrical_controls_inspection?.air_conditioner
        ),
        climate_control: formatSelectOption(
            data?.electrical_controls_inspection?.climate_control
        ),
        entertainment_system: formatSelectOption(
            data?.electrical_controls_inspection?.entertainment_system
        ),
        side_mirror_controls: formatSelectOption(
            data?.electrical_controls_inspection?.side_mirror_controls
        ),
        head_lights: formatSelectOption(
            data?.electrical_controls_inspection?.head_lights
        ),
        rear_lights: formatSelectOption(
            data?.electrical_controls_inspection?.rear_lights
        ),
        fog_lights: formatSelectOption(
            data?.electrical_controls_inspection?.fog_lights
        ),
        interior_lights: formatSelectOption(
            data?.electrical_controls_inspection?.interior_lights
        ),
        indicators_side_lights: formatSelectOption(
            data?.electrical_controls_inspection?.indicators_side_lights
        ),
        key_remote_battery: formatSelectOption(
            data?.electrical_controls_inspection?.key_remote_battery
        ),
        lcd_display: formatSelectOption(
            data?.electrical_controls_inspection?.lcd_display
        ),
        cameras: formatSelectOption(
            data?.electrical_controls_inspection?.cameras
        ),
        push_start: formatSelectOption(
            data?.electrical_controls_inspection?.push_start
        ),
        instrument_functions: formatSelectOption(
            data?.electrical_controls_inspection?.instrument_functions
        ),
        wipers_washers: formatSelectOption(
            data?.electrical_controls_inspection?.wipers_washers
        ),
        door_locking: formatSelectOption(
            data?.electrical_controls_inspection?.door_locking
        ),
        switches_controls: formatSelectOption(
            data?.electrical_controls_inspection?.switches_controls
        ),
        steering_wheel_switches: formatSelectOption(
            data?.electrical_controls_inspection?.steering_wheel_switches
        ),
        hazard_lights_button: formatSelectOption(
            data?.electrical_controls_inspection?.hazard_lights_button
        ),
        starting_system_ignition_lock: formatSelectOption(
            data?.electrical_controls_inspection?.starting_system_ignition_lock
        ),
        sunroof_switch_board: formatSelectOption(
            data?.electrical_controls_inspection?.sunroof_switch_board
        ),
        rear_power_window_switch: formatSelectOption(
            data?.electrical_controls_inspection?.rear_power_window_switch
        ),
        front_power_window_switch: formatSelectOption(
            data?.electrical_controls_inspection?.front_power_window_switch
        ),

        // Adding suspension steering inspection fields
        steering_rack: formatSelectOption(
            data?.suspension_steering_inspection?.steering_rack
        ),
        rack_end: formatSelectOption(
            data?.suspension_steering_inspection?.rack_end
        ),
        front_differential: formatSelectOption(
            data?.suspension_steering_inspection?.front_differential
        ),
        right_springs_shock_absorbers: formatSelectOption(
            data?.suspension_steering_inspection?.right_springs_shock_absorbers
        ),
        right_axle: formatSelectOption(
            data?.suspension_steering_inspection?.right_axle
        ),
        right_ball_joint: formatSelectOption(
            data?.suspension_steering_inspection?.right_ball_joint
        ),
        power_steering: formatSelectOption(
            data?.suspension_steering_inspection?.power_steering
        ),
        power_steering_fluid: formatSelectOption(
            data?.suspension_steering_inspection?.power_steering_fluid
        ),
        wheel_hubs_bearings: formatSelectOption(
            data?.suspension_steering_inspection?.wheel_hubs_bearings
        ),
        left_springs_shock_absorbers: formatSelectOption(
            data?.suspension_steering_inspection?.left_springs_shock_absorbers
        ),
        left_axle: formatSelectOption(
            data?.suspension_steering_inspection?.left_axle
        ),
        left_ball_joint: formatSelectOption(
            data?.suspension_steering_inspection?.left_ball_joint
        ),
        left_dampers_bushes: formatSelectOption(
            data?.suspension_steering_inspection?.left_dampers_bushes
        ),
        right_rear_shock_absorbers: formatSelectOption(
            data?.suspension_steering_inspection?.right_rear_shock_absorbers
        ),
        right_rear_bushes: formatSelectOption(
            data?.suspension_steering_inspection?.right_rear_bushes
        ),
        left_rear_shock_absorbers: formatSelectOption(
            data?.suspension_steering_inspection?.left_rear_shock_absorbers
        ),
        left_rear_bushes: formatSelectOption(
            data?.suspension_steering_inspection?.left_rear_bushes
        ),
        steering_box: formatSelectOption(
            data?.suspension_steering_inspection?.steering_box
        ),
        right_dampers_bushes: formatSelectOption(
            data?.suspension_steering_inspection?.right_dampers_bushes
        ),

        // Adding interiors inspection fields
        spare_wheel: data?.interiors_inspection?.spare_wheel,
        window_blinds: data?.interiors_inspection?.window_blinds,
        dashboard_condition: formatSelectOption(
            data?.interiors_inspection?.dashboard_condition
        ),
        speedometer_cluster: formatSelectOption(
            data?.interiors_inspection?.speedometer_cluster
        ),
        steering_wheel: formatSelectOption(
            data?.interiors_inspection?.steering_wheel
        ),
        center_console_box: formatSelectOption(
            data?.interiors_inspection?.center_console_box
        ),
        visor: formatSelectOption(data?.interiors_inspection?.visor),
        internal_mirrors: formatSelectOption(
            data?.interiors_inspection?.internal_mirrors
        ),
        door_fittings_operation: formatSelectOption(
            data?.interiors_inspection?.door_fittings_operation
        ),
        door_hinges: formatSelectOption(
            data?.interiors_inspection?.door_hinges
        ),
        interior_sills_door_shuts: formatSelectOption(
            data?.interiors_inspection?.interior_sills_door_shuts
        ),
        trim_panels: formatSelectOption(
            data?.interiors_inspection?.trim_panels
        ),
        carpets: formatSelectOption(data?.interiors_inspection?.carpets),
        arm_rest: formatSelectOption(data?.interiors_inspection?.arm_rest),
        seat_leather_fabric: formatSelectOption(
            data?.interiors_inspection?.seat_leather_fabric
        ),
        seat_belts: formatSelectOption(data?.interiors_inspection?.seat_belts),
        front_right_seat_control: formatSelectOption(
            data?.interiors_inspection?.front_right_seat_control
        ),
        front_left_seat_control: formatSelectOption(
            data?.interiors_inspection?.front_left_seat_control
        ),
        boot_trunk_area: formatSelectOption(
            data?.interiors_inspection?.boot_trunk_area
        ),
        tools_safety_kit: formatSelectOption(
            data?.interiors_inspection?.tools_safety_kit
        ),

        // Adding exteriors inspection fields
        bumpers: formatSelectOption(data?.exteriors_inspection?.bumpers),
        number_plates: formatSelectOption(
            data?.exteriors_inspection?.number_plates
        ),
        right_side_mirror: formatSelectOption(
            data?.exteriors_inspection?.right_side_mirror
        ),
        left_side_mirror: formatSelectOption(
            data?.exteriors_inspection?.left_side_mirror
        ),
        grill: formatSelectOption(data?.exteriors_inspection?.grill),
        wheel_caps_alloys: formatSelectOption(
            data?.exteriors_inspection?.wheel_caps_alloys
        ),
        chassis: formatSelectOption(data?.exteriors_inspection?.chassis),
        fender_shield: formatSelectOption(
            data?.exteriors_inspection?.fender_shield
        ),

        // Adding road test inspection fields
        traction_control: formatSelectOption(
            data?.road_test_inspection?.traction_control
        ),
        engine_performance: formatSelectOption(
            data?.road_test_inspection?.engine_performance
        ),
        overheating_evidence: formatSelectOption(
            data?.road_test_inspection?.overheating_evidence
        ),
        gear_shifting: formatSelectOption(
            data?.road_test_inspection?.gear_shifting
        ),
        cruise_control: formatSelectOption(
            data?.road_test_inspection?.cruise_control
        ),
        ac_operation: formatSelectOption(
            data?.road_test_inspection?.ac_operation
        ),
        steering_alignment: formatSelectOption(
            data?.road_test_inspection?.steering_alignment
        ),
        brake_operation: formatSelectOption(
            data?.road_test_inspection?.brake_operation
        ),

        // tyre
        front_left_tyre_manufacturer:
            data?.tyres_inspection?.front_left?.manufacturer || null,
        front_left_tyre_production_date:
            data?.tyres_inspection?.front_left?.production_date || null,
        front_left_tyre_condition: formatSelectOption(
            data?.tyres_inspection?.front_left?.condition
        ),

        front_right_tyre_manufacturer:
            data?.tyres_inspection?.front_right?.manufacturer || null,
        front_right_tyre_production_date:
            data?.tyres_inspection?.front_right?.production_date || null,
        front_right_tyre_condition: formatSelectOption(
            data?.tyres_inspection?.front_right?.condition
        ),

        rear_left_tyre_manufacturer:
            data?.tyres_inspection?.rear_left?.manufacturer || null,
        rear_left_tyre_production_date:
            data?.tyres_inspection?.rear_left?.production_date || null,
        rear_left_tyre_condition: formatSelectOption(
            data?.tyres_inspection?.rear_left?.condition
        ),

        rear_right_tyre_manufacturer:
            data?.tyres_inspection?.rear_right?.manufacturer || null,
        rear_right_tyre_production_date:
            data?.tyres_inspection?.rear_right?.production_date || null,
        rear_right_tyre_condition: formatSelectOption(
            data?.tyres_inspection?.rear_right?.condition
        ),
    };
}

function formatSelectOption(value) {
    if (!value) return null;
    return {
        value: value,
        label: value,
    };
}
