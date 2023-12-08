using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LightToggle : MonoBehaviour
{
    public UnityEngine.Rendering.Universal.Light2D light2D;
    public UnityEngine.Rendering.Universal.Light2D light2D2; 
    
    private Button button;
    public Sprite imageOff;
    public Sprite imageOn;

    //Lista de SFX:
    [SerializeField] private AudioClip sfxLight;

    private void Start()
    {
        button = GetComponent<Button>();
        button.onClick.AddListener(ToggleLight);
    }

    private void ToggleLight()
    {
        //light2D.enabled = !light2D.enabled;
        light2D.gameObject.SetActive(!light2D.gameObject.activeSelf);
        light2D2.enabled = !light2D2.enabled;
        SoundManager.instance.playMenuSFX((int)SoundManager.ListaSFX.menuLuz);
        
        if(light2D2.enabled) {
            button.image.sprite = imageOn;
        } else {
            button.image.sprite = imageOff;
        }
        

        if (!light2D.gameObject.activeSelf) {
            SoundManager.instance.stopDinamicBGM();
        }

    }
}
