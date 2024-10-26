"use client"
import DiceIcon from '../../public/dice.svg'
import Image from 'next/image';
import { ribxz_api, useRoutersRouterStructAllRcsbIdsQuery, useRoutersRouterStructListLigandsQuery, useRoutersRouterStructPolymerClassesNomenclatureQuery, useRoutersRouterStructPolymerClassesStatsQuery, useRoutersRouterStructRandomProfileQuery, useRoutersRouterStructStructureCompositionStatsQuery } from '@/store/ribxz_api/ribxz_api';
import Link from "next/link"
import '@/components/mstar/mstar.css'
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button"
import { SidebarMenu } from '@/components/ribxz/sidebar_menu';
import { Separator } from '@/components/ui/separator';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { HoverCard, HoverCardContent, HoverCardTrigger, } from "@/components/ui/hover-card"
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import * as React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { StructureCard } from '@/components/ribxz/structure_card';
import { useAppSelector } from '@/store/store';
import { MolstarNode, MySpec } from '@/components/mstar/lib';
import { MolstarRibxz, MyViewportControls } from '@/components/mstar/molstar_wrapper_class';
import { DefaultPluginUISpec, PluginUISpec } from 'molstar/lib/mol-plugin-ui/spec';
import { PluginConfig } from 'molstar/lib/mol-plugin/config';
import { PluginSpec } from 'molstar/lib/mol-plugin/spec';
import { StateTransforms } from 'molstar/lib/mol-plugin-state/transforms';
import { BoxifyVolumeStreaming, CreateVolumeStreamingBehavior, InitVolumeStreaming } from 'molstar/lib/mol-plugin/behavior/dynamic/volume-streaming/transformers';
import { StateActions } from 'molstar/lib/mol-plugin-state/actions';
import { Quat, Vec3 } from 'molstar/lib/mol-math/linear-algebra';
import { PluginCommands } from 'molstar/lib/mol-plugin/commands';
import { mode } from 'd3';
import { range } from 'lodash';


export const TunnelDemo = () => {

    const [ctx, setCtx] = useState<MolstarRibxz | null>(null);
    const rcsb_id = '4UG0'
    const molstarNodeRef = useRef<HTMLDivElement>(null);

    // !Autoload structure
    useEffect(() => {
        (async () => {
            const x = new MolstarRibxz
            const custom_spec: PluginUISpec = {
                ...DefaultPluginUISpec(),
                actions: [],
                config: [
                ],
                components: {
                    disableDragOverlay: true,
                    hideTaskOverlay   : true,
                    viewport          : {
                        controls: MyViewportControls
                    },
                    controls: {
                        right: "none",
                        bottom: 'none',
                        left: 'none',
                        top: "none"
                    },
                    remoteState: 'none',
                },
                layout: {
                    initial: {
                        showControls: false,
                        regionState: {
                            bottom: 'hidden',
                            left  : 'hidden',
                            right : 'hidden',
                            top   : 'hidden'
                        },
                        isExpanded: false
                    }
                }

            }
            await x.init(molstarNodeRef.current!, custom_spec)
            setCtx(x)
        })()
    }, [])

    useEffect(() => {

        // (async () => {
        //     const LC = await ctx?.load_mmcif_chain({ auth_asym_id: 'LC', rcsb_id: '4UG0' })
        //     let LC_residues = []
        //     for (var i of range(57, 103)) {
        //         LC_residues.push(i)
        //     }
        //     console.log(LC_residues);
        //     ctx?.select_multiple_residues([['LC', LC_residues]], LC?.data)

        //     ctx?.create_ball_and_stick_representation(LC!, 'some')
        // }

        // )()

        // const LP = ctx?.load_mmcif_chain({ auth_asym_id: 'LP', rcsb_id: '4UG0' })
        // // 120-144

        // let LP_residues = []
        // for (var j in range(120,144)) {
        //     LP_residues.push( Number.parseInt(j) )
        // }


        ctx?.tunnel_geoemetry('4UG0')
        if (ctx?.ctx) {
            const snapshot = ctx?.ctx.canvas3d?.camera.getSnapshot();
            const newSnapshot = { ...snapshot, up: Vec3.create(-1,0,0), };
             ctx?.ctx.canvas3d?.camera.setState(newSnapshot,500)
        }
        ctx?.toggleSpin()


    }, [ctx, rcsb_id])


    return (
        <div className="grid grid-cols-2 gap-8 w-full py-8">
            <Card className=" space-y-4 h-80 rounded-md p-2 shadow-inner ">
                <MolstarNode ref={molstarNodeRef} />
            </Card>
        </div>
    );
}
