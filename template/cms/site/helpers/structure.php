<?php
    function structure($structureField, $items) {
        $structure_result = array();
        $structure_current_item = array();

        foreach ($structureField->toStructure() as $structureItem) {
            foreach($items as $item) {
                array_push($structure_current_item, array($item => $structureItem->{$item}(), "field" => $item));
            }
            array_push($structure_result, $structure_current_item);
            $structure_current_item = [];
        } 

        return $structure_result;
    }
?>
