"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HoverMenu } from "../structures/page"
import { Filters, Group } from "@/components/ribxz/filters"
import {PaginationElement} from '@/components/ribxz/pagination_element'
import { SidebarMenu } from "@/components/ribxz/sidebar_menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/store"
import React from 'react';
import { Select } from 'antd';
import { PolymerClassOption, groupedOptions } from "@/components/ribxz/filters_protein_class_options"
import { set_current_polymer_class, set_current_polymers } from "@/store/slices/ui_state"
import { ribxz_api, useRoutersRouterStructPolymerClassesNomenclatureQuery, useRoutersRouterStructPolymersByPolymerClassQuery } from "@/store/ribxz_api/ribxz_api"
import PolymersTable from "@/components/ribxz/polymer_table"



interface PolymerInputProps {
    isDisabled?: boolean
}

function PolymerInput(props: PolymerInputProps) {

    const [polymerClassOptions, setPolymerClassOptions] = useState<PolymerClassOption[]>([]);
    const dispatch = useAppDispatch();
    const { data: nomenclature_classes, isLoading: nomenclature_classes_is_loading } = useRoutersRouterStructPolymerClassesNomenclatureQuery();
    useEffect(() => {
        if (!nomenclature_classes_is_loading) {
            setPolymerClassOptions(groupedOptions(nomenclature_classes))
        }
    }, [nomenclature_classes, nomenclature_classes_is_loading]);



    return <div className="flex flex-col items-center border rounded-sm pb-2 pr-2 pl-2 pt-2 mb-4">
        <Label htmlFor="input" className={`font-bold text-md mb-2   ${props.isDisabled ? "disabled-text" : ""} `}> Polymer Class</Label>
        <Select<PolymerClassOption >
            defaultValue={null}
            className="w-full max-h-64"
            components={{ Group }}
            options={polymerClassOptions}
            onChange={(value) => {
                dispatch(set_current_polymer_class(value))
            }}
            disabled={props.isDisabled}
        />

    </div>
}

export default function PolymersPage() {
    const [tab, setTab]    = useState("by_polymer_class");
    const dispatch         = useAppDispatch();
    const onTabChange      = (value: string) => { setTab(value); }
    const current_polymers = useAppSelector((state) => state.ui.data.current_polymers)
    //! -----------

    // const current_polymers = useAppSelector((state) => state.ui.data.current_polymers)

    const [triggerPolymersRefetch_byPolymerClass, { polymers_data_byPolymerClass, polymers_error_byPolymerClass }] = ribxz_api.endpoints.routersRouterStructPolymersByPolymerClass.useLazyQuery()
    const [triggerPolymersRefetch_byStructure, { polymers_data_byStructure, polymers_error_byStructure }] = ribxz_api.endpoints.routersRouterStructPolymersByStructure.useLazyQuery()

    const filter_state          = useAppSelector((state) => state.ui.filters)
    const current_polymer_class = useAppSelector((state) => state.ui.polymers.current_polymer_class)
    const current_polymer_page  = useAppSelector((state) => state.ui.pagination.current_polymers_page)
    const pagination_poly       = useAppSelector((state) => state.ui.pagination)

    useEffect(() => {
        if (tab == "by_polymer_class") {
            if (current_polymer_class != null) {
                triggerPolymersRefetch_byPolymerClass({ polymerClass: current_polymer_class, page: current_polymer_page })
            }
            else {
                dispatch(set_current_polymers([]))
            }
        }
        else if (tab == "by_structure") {
            triggerPolymersRefetch_byStructure({
                page: current_polymer_page,
                year: filter_state.year.map(x => x === null || x === 0 ? null : x.toString()).join(','),
                resolution: filter_state.resolution.map(x => x === null || x === 0 ? null : x.toString()).join(','),
                hostTaxa: filter_state.host_taxa.length == 0 ? '' : filter_state.host_taxa.map(x => x === null ? null : x.toString()).join(','),
                sourceTaxa: filter_state.source_taxa.length == 0 ? '' : filter_state.source_taxa.map(x => x === null ? null : x.toString()).join(','),
                polymerClasses: filter_state.polymer_classes.length == 0 ? '' : filter_state.polymer_classes.join(','),
                search: filter_state.search === null ? '' : filter_state.search
            }).unwrap()
        }
    }, [tab, current_polymer_page])

    useEffect(() => {
        if (current_polymer_class != null) {
            triggerPolymersRefetch_byPolymerClass({ polymerClass: current_polymer_class, page: 1 })
        }
        else {
            dispatch(set_current_polymers([]))
        }
    }, [current_polymer_class])

    useEffect(() => {
        if (current_polymer_class != null) {
            triggerPolymersRefetch_byPolymerClass({ polymerClass: current_polymer_class, page: current_polymer_page })
        }
        else {
            dispatch(set_current_polymers([]))
        }
    }, [current_polymer_page])




    return (
        // This needs two tabs "by structure" and "by polymer Class"
        <div className="max-w-screen max-h-screen min-h-screen p-4 flex flex-col flex-grow  outline ">
            <HoverMenu />
            <h1 className="text-2xl font-bold mb-6 ">Polymers</h1>
            <div className="grow"  >
                <div className="grid grid-cols-12 gap-4 min-h-[90vh]    ">
                    <div className="col-span-3  flex flex-col min-h-full pr-4">
                        <PolymerInput isDisabled={tab == "by_structure"} />
                        <Filters disabled_whole={tab == "by_polymer_class"} />
                        <SidebarMenu />
                        <div className="p-1 my-4 rounded-md border w-full">
                            <PaginationElement slice_type={"polymers"} />
                        </div>
                    </div>
                    <div className="col-span-9 scrollbar-hidden">
                        <ScrollArea className=" max-h-[90vh] overflow-y-scroll scrollbar-hidden" scrollHideDelay={1} >
                            <div className=" gap-4 flex  flex-wrap  p-1 scrollbar-hidden"  >
                                <Tabs defaultValue="by_polymer_class" value={tab} onValueChange={onTabChange}>
                                    <TabsList className="grid w-full grid-cols-2">
                                        {/* TODO: Add tooltip what each means */}
                                        <TabsTrigger className="w-full" value="by_polymer_class">By Polymer Class</TabsTrigger>
                                        <TabsTrigger className="w-full" value="by_structure" >By Structure</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="by_polymer_class">
                                        <PolymersTable
                                            if_empty_prompt={<div className="text-center w-full"> { "<---" } Select a Polymer Class</div>}

                                            proteins={current_polymers.filter(p => p.entity_poly_polymer_type === 'Protein')}
                                            rnas    ={current_polymers.filter(p => p.entity_poly_polymer_type === 'RNA'    )} />
                                    </TabsContent>
                                    <TabsContent value="by_structure">
                                        <PolymersTable
                                            proteins={current_polymers.filter(p => p.entity_poly_polymer_type === 'Protein')}
                                            rnas    ={current_polymers.filter(p => p.entity_poly_polymer_type === 'RNA'    )} />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>

    )
}