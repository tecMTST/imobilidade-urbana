using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Indicator : MonoBehaviour{

    public Image image;
    public Image subImage;

  
    public void SetSpriteImage(Sprite sprite) {
        image.sprite = sprite;          
    }


    public void SetSpriteSubImage(Sprite sprite) {
        subImage.gameObject.SetActive(true);   
        subImage.sprite = sprite;
    }
}
