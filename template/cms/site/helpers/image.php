<?php
    class ImgSize
    {
        const XS = 720;
        const SM = 720;
        const MD = 720;
        const LG = 1000;
        const XL = 1500;
        const XXL = 2000;
        const XXXL = 2500;
    }

    /**
     * Transform all the images to data that is useful
     * 
     * @param $file_or_files - accepts either File (toFile) or Files (toFiles())
     * @return array - images objects as array or as a single object
     */
    function json_image($file_or_files) {
        if ($file_or_files == null) {
            return null;
        } 

        $thumbnail_width = 100;
        $ImageSizes = [ImgSize::XS, ImgSize::SM, ImgSize::MD, ImgSize::LG, ImgSize::XL, ImgSize::XXL, ImgSize::XXXL];

        if ($file_or_files instanceof Kirby\Cms\Files) {
            $imagesArray = array();
            $images = $file_or_files;

            foreach($images as $image) {
                $width = $image->width();
                $height = $image->height();
                
                if ($image->width() == 0 || $image->height() == 0) {
                    $width = 1;
                    $height = 1;
                }

                array_push($imagesArray, array("name" => $image->name(), "url" => $image->url(), "srcset" => $image->srcset($ImageSizes), "width" => $image->width(), "height" => $image->height(), "alt" => $image->name(), "id" => $image->id(), "thumbnail" => $image->thumb(
                    [
                        'width'     => $thumbnail_width,
                        'height'    => (($thumbnail_width / (($width / $height)))),
                        'crop'      => 'center',
                        'format'    => 'jpg',
                        'blur'      => 10
                    ]
                )->url(), "imgExtensionWithoutDot" => $image->extension()));
            }
            
            return $imagesArray;
        }

        $image = $file_or_files;

        $width = $image->width();
        $height = $image->height();

        if ($image->width() == 0 || $image->height() == 0) {
            $width = 1;
            $height = 1;
        }

        return array("name" => $image->name(), "url" => $image->url(), "srcset" => $image->srcset($ImageSizes), "width" => $image->width(), "height" => $image->height(), "alt" => $image->name(), "id" => $image->id(), "thumbnail" => $image->thumb(
            [
                'width'     => $thumbnail_width,
                'height'    => (($thumbnail_width / (($width / $height)))),
                'crop'      => 'center',
                'format'    => 'jpg'
            ]
        )->url(), "imgExtensionWithoutDot" => $image->extension());
    }
?>
