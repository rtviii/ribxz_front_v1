'use client'
import { MolStarWrapper } from '@/components/mstar/mstar_wrapper'
import {StructureSelectionManager,StructureSelectionModifier,StructureSelectionSnapshot} from 'molstar/lib/mol-plugin-state/manager/structure/selection'
import {StructureComponentManager} from 'molstar/lib/mol-plugin-state/manager/structure/component'
import { MolScriptBuilder as MS, MolScriptBuilder } from 'molstar/lib/mol-script/language/builder';
import { Fragment, useState } from 'react'
import { Queries, StructureQuery, StructureSelection } from "molstar/lib/mol-model/structure";
import { Dialog } from '@headlessui/react'
import { CalendarIcon, ChartPieIcon, DocumentDuplicateIcon, FolderIcon, HomeIcon, UsersIcon, } from '@heroicons/react/24/outline'
import { Loci } from 'molstar/lib/mol-model/loci'

import {Structure, StructureElement, StructureProperties} from 'molstar/lib/mol-model/structure/structure'
import { StructureSelectionQueries, StructureSelectionQuery } from 'molstar/lib/mol-plugin-state/helpers/structure-selection-query'
import { log } from 'console';
const navigation = [
  { name: 'Structures', href: '#', icon: HomeIcon, current: true },
  { name: 'Polynucleotides', href: '#', icon: FolderIcon, current: false },
  { name: 'Polypeptides', href: '#', icon: FolderIcon, current: false },
  { name: 'Ligands', href: '#', icon: FolderIcon, current: false },
  { name: 'Classification', href: '#', icon: DocumentDuplicateIcon, current: false },
]
const tools = [
  { id: 1, name: '3D Align', href: '#', initial: 'A', current: false },
  { id: 2, name: 'Binding Interface Prediction', href: '#', initial: 'I', current: false },
  { id: 3, name: 'Model-to-Density Fit', href: '#', initial: 'D', current: false },
  { id: 3, name: '[WIP] Viewer State', href: '#', initial: 'S', current: false },
  { id: 3, name: '[WIP] Load Density', href: '#', initial: 'S', current: false },
]

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

const try_select_chain = () =>{
  var selection:any = (l:any) => StructureProperties.chain.auth_asym_id(l.element) === 'A'
  var k             = Queries.combinators.merge([ Queries.generators.atoms(selection)])
  const { core, struct } = MolScriptBuilder;
  const expressions= []

  var proteins = StructureSelectionQueries.protein

  const propTests: Parameters<typeof struct.generator.atomGroups>[0] = {
    'chain-test' : core.rel.eq([struct.atomProperty.macromolecular.auth_asym_id, 'A']), 
    'group-by': struct.atomProperty.core.operatorName(),
  }    
  expressions.push(struct.filter.first([struct.generator.atomGroups(propTests)]));
  const e = struct.combinator.merge(expressions);

  const sq1_prot = StructureSelectionQuery('some_name', proteins.expression)
  const sq2 = StructureSelectionQuery('chain_A', e)

  console.log(sq1_prot)
  console.log(sq2)
  const sel  = window.molstar?.managers.structure.selection.fromSelectionQuery('add',sq1_prot )
  console.log(sel);
  
  // console.log(window.molstar?.managers.structure.selection.fromLoci('add', ))

}

const log_selection_manager = () =>{
  console.log(window.molstar?.managers.structure.hierarchy.selection.structures);
  
  // const ligandPlusSurroundings = StructureSelectionQuery('Surrounding Residues (5 \u212B) of Ligand plus Ligand itself', MS.struct.modifier.union([
  //     MS.struct.modifier.includeSurroundings({
  //         0: StructureSelectionQueries.ligand.expression,
  //         radius: 5,
  //         'as-whole-residues': true
  //     })
  // ]));
  console.log(StructureSelectionQueries.ligand)
}


export default function Example() {
  return (
    <>
      <div>
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-8 w-auto"
                       src="/ray-logo-transp.png" 
                alt="riboxyz"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">Structure Tools</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {tools.map((team) => (
                      <li 
                      onClick={()=>{console.log()}}
                      
                      key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? 'bg-gray-50 text-indigo-600'
                              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                          )}
                        >
                          <span className={classNames( team.current ? 'text-indigo-600 border-indigo-600' : 'text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600', 'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white' )} >
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                    <li>
                       <button onClick={()=>{try_select_chain()}} type="button" className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" > try chain </button>
                    </li>
                    <li>
                       <button onClick={()=>{log_selection_manager()}} type="button" className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" > Log Manager </button>

                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <main className=" lg:pl-72">
          <MolStarWrapper />
        </main>
      </div>
    </>
  )
}