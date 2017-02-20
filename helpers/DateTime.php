<?php
namespace app\helpers;

/**
 * Description of DateTime
 *
 * @author mateusz
 */
class DateTime {
	
	const DATETIME_FORMAT = 'Y-m-d H:i:s';

	public static function now($format = null) {	
		$format = (is_null($format))?self::DATETIME_FORMAT:$format;
		return date($format);
	}
}

?>
