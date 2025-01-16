import React, {useEffect, useState} from 'react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {TooltipProvider, Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {Eye} from 'lucide-react';
import {cn} from '@/components/utils';
import {useAppSelector} from '@/store/store';
import {RibosomeStructure, useRoutersRouterStructGetHelicesQuery} from '@/store/ribxz_api/ribxz_api';
import {useMolstarInstance} from '@/components/mstar/mstar_service';
import {sort_by_polymer_class} from '@/my_utils';
import PolymerComponentRow from './polymer_component';
import SequenceMolstarSync from '@/app/components/sequence_molstar_sync';
import {LandmarkHandlers, LocationLandmark, RegionLandmark} from '../landmarks/types';
import LandmarkRow from '../landmarks/landmark_row';
import { LandmarksPanel } from '../landmarks/helix_panel';
const ptcLandmark: LocationLandmark = {
    id: 'ptc-1',
    name: 'Peptidyl Transferase Center',
    type: 'location',
    coordinates: [10, 20, 30],
    description: 'Catalytic center of the ribosome'
};

const helix26: RegionLandmark = {
    id: 'h26',
    name: 'Helix 26',
    type: 'region',
    chain_id: '16S',
    start_residue: 824,
    end_residue: 869,
    description: 'Part of the central domain'
};

const landmarkHandlers: LandmarkHandlers = {
    onToggleVisibility: id => {
        /* implementation */
    },
    onHighlight: id => {
        /* implementation */
    },
    onFocus: id => {
        /* implementation */
    },
    onExport: id => {
        /* implementation */
    }
};
const ComponentsEasyAccessPanel = ({data, isLoading}: {data: RibosomeStructure; isLoading: boolean}) => {
    const [activeView, setActiveView] = useState('polymers');
    const service                     = useMolstarInstance('main');
    const state                       = useAppSelector(state => state);
    const rcsb_id                     = Object.keys(state.mstar_refs.instances.main.rcsb_id_components_map)[0];

    const {data: helices_data}        = useRoutersRouterStructGetHelicesQuery({rcsb_id: data?.rcsb_id});

    useEffect(() => {
        console.log(helices_data);
    }, [helices_data]);

    if (isLoading) return <div className="text-xs">Loading components...</div>;
    if (!service?.viewer || !service?.controller) {
        return <div className="text-xs">Initializing viewer...</div>;
    }

    const {controller: msc} = service;

    const tabs = [
        {id: 'polymers', label: 'Polymers'},
        {id: 'landmarks', label: 'Landmarks'},
        {id: 'ligands', label: 'Ligands'}
    ];

    return (
        <div className="flex flex-col h-full">
            <div className="h-8 flex items-center justify-between bg-gray-50 border-b">
                <div className="flex items-center">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveView(tab.id)}
                            className={cn(
                                'px-3 py-1 text-xs transition-colors',
                                activeView === tab.id
                                    ? 'bg-white text-blue-600 font-medium'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            )}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                onClick={() => msc.polymers.restoreAllVisibility(rcsb_id)}
                                className="rounded-md px-2 py-1 text-sm text-gray-600 hover:bg-gray-100">
                                <Eye className="h-4 w-4" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>Show all components</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div className="flex-grow min-h-0 relative overflow-hidden mt-4">
                <div
                    className={cn('flex transition-transform duration-300 w-[300%] h-full', {
                        'translate-x-0': activeView === 'polymers',
                        '-translate-x-1/3': activeView === 'landmarks',
                        '-translate-x-2/3': activeView === 'ligands'
                    })}>
                    <div className="w-1/3 h-full flex-shrink-0">
                        <ScrollArea className="h-full">
                            <div className="space-y-1">
                                <SequenceMolstarSync />
                                {[...data.rnas, ...data.proteins, ...data.other_polymers]
                                    .toSorted(sort_by_polymer_class)
                                    .filter(r => r.assembly_id === 0)
                                    .map(component => (
                                        <PolymerComponentRow polymer={component} key={component.auth_asym_id} />
                                    ))}
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="w-1/3 h-full flex-shrink-0">
                        <ScrollArea className="h-full">
                            <div>
                                <div className="text-sm text-gray-500">
                                    <LandmarksPanel helicesData={helices_data}/>

                                </div>
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="w-1/3 h-full flex-shrink-0">
                        <ScrollArea className="h-full">
                            <div>
                                <div className="text-sm text-gray-500">Ligands view (to be implemented)</div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentsEasyAccessPanel;
